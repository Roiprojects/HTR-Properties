import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check Supabase Auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Also check demo fallback for local testing without Supabase credentials
      const demoAuth = localStorage.getItem("demo_admin_auth") === "true";
      
      if (session || demoAuth) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const demoAuth = localStorage.getItem("demo_admin_auth") === "true";
      setIsAuthenticated(!!session || demoAuth);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent-violet/30 border-t-accent-violet rounded-full animate-spin"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
