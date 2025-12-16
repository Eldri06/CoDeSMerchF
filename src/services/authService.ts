// src/services/authService.ts
import { auth, database } from "@/config/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";
import { ref, set, get } from "firebase/database";

const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

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
  status?: string;
  systemRole?: string;
  requestedRole?: string;
  avatarUrl?: string;
}

export const authService = {
  // Register new user
  async register(data: RegisterData): Promise<{ success: boolean; message: string; user?: UserData }> {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          role: data.role,
          studentId: data.studentId,
          phone: data.phone,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        return { success: false, message: json.error || "Registration failed. Please try again." };
      }

      return {
        success: true,
        message: String(json.message || "Registration successful!"),
      };
    } catch (e) {
      return { success: false, message: "Registration failed. Please try again." };
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

      const status = String(userData.status || '').toLowerCase();
      if (status !== 'active') {
        const msg = status === 'pending' ? 'Approval is needed' : 'Account is not active';
        return { success: false, message: msg };
      }

      // Step 3: Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      return {
        success: true,
        message: "Login successful!",
        user: userData,
      };
    } catch (error: unknown) {
      console.error("Login error:", error);

      let errorMessage = "Login failed. Please try again.";

      const err = error as { code?: string };
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errorMessage = "Invalid email or password.";
      } else if (err.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (err.code === "auth/too-many-requests") {
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

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json().catch(() => ({}));
      return {
        success: !!json.success,
        message: String(json.message || "If the email exists, a reset link has been sent"),
      };
    } catch {
      return { success: true, message: "If the email exists, a reset link has been sent" };
    }
  },
};
