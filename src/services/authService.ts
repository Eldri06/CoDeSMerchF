// src/services/authService.ts
import { auth, database } from "@/config/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";
import { ref, set, get } from "firebase/database";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  role: string;
  studentId: string;
  phone?: string;
  organization?: string;
  department?: string;
}

interface UserData {
  uid: string;
  email: string;
  fullName: string;
  role: string;
  studentId: string;
  phone?: string;
  organization?: string;
  department?: string;
  createdAt: string;
}

export const authService = {
  // Register new user
  async register(data: RegisterData): Promise<{ success: boolean; message: string; user?: UserData }> {
    try {
      // Step 1: Create Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        data.email, 
        data.password
      );
      
      const user = userCredential.user;

      // Step 2: Create user profile in Realtime Database
      const userData: UserData = {
        uid: user.uid,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        studentId: data.studentId,
        phone: data.phone || "",
        organization: data.organization || "Computer Debuggers Society",
        department: data.department || "Department of Computing Education",
        createdAt: new Date().toISOString(),
      };

     
      await set(ref(database, `users/${user.uid}`), userData);

   
      try {
        await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: user.uid,
            ...userData,
          }),
        });
      } catch (backendError) {
        console.warn("Backend registration failed, but Firebase succeeded:", backendError);
      }

      return {
        success: true,
        message: "Registration successful!",
        user: userData,
      };
    } catch (error: any) {
      console.error("Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password should be at least 6 characters.";
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  // Login user
  async login(email: string, password: string): Promise<{ success: boolean; message: string; user?: UserData }> {
    try {
      // Step 1: Authenticate with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Get user data from Realtime Database
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        throw new Error("User data not found");
      }

      const userData = snapshot.val() as UserData;

      // Step 3: Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      return {
        success: true,
        message: "Login successful!",
        user: userData,
      };
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later.";
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  // Get current user from localStorage
  getCurrentUser(): UserData | null {
    const userJson = localStorage.getItem("user");
    return userJson ? JSON.parse(userJson) : null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },
};