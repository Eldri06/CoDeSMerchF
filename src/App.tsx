
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import { EventProvider } from "@/context/EventContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { database } from "@/config/firebase";
import { ref, push, set, update, serverTimestamp } from "firebase/database";
import { authService } from "@/services/authService";

const queryClient = new QueryClient();

const RouteActivityTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const u = authService.getCurrentUser();
    if (!u) return;

    const roleLc = String(u.systemRole || "").toLowerCase();
    const allowed = new Set([
      "super_admin",
      "president",
      "vice_president",
      "officer",
      "secretary",
      "treasurer",
      "pio",
    ]);
    if (!allowed.has(roleLc)) return;

    const uid = u.uid;
    const logRef = push(ref(database, `activityLogs/${uid}`));
    set(logRef, { path: location.pathname, ts: serverTimestamp() });
    update(ref(database, `users/${uid}`), { lastActiveAt: serverTimestamp() });
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EventProvider>
        <BrowserRouter>
          <RouteActivityTracker />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </EventProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
