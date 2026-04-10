import { Menu, Bell, LogOut, ChevronRight, Sun, Moon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { useAdminTheme } from "../../contexts/AdminThemeContext";

export default function AdminHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { isDark, toggleDark } = useAdminTheme();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const pathParts = pathname.split('/').filter(Boolean);
  const title = pathParts.length > 1 ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1) : "Overview";

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Clear demo auth as well
      localStorage.removeItem("demo_admin_auth");
      toast.success("Successfully logged out");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <header className="h-20 bg-primary border-b border-black/5 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-40 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-lg text-chrome/70 hover:text-chrome hover:bg-black/5 lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-sm text-chrome/50 font-mono uppercase tracking-widest">
          <span>Admin</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-chrome">{title}</span>
        </div>
        <h1 className="sm:hidden text-lg font-serif text-chrome">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleDark}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-chrome/70 hover:bg-black/5 hover:text-chrome transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button 
          onClick={() => {
            navigate('/admin/leads');
            toast.success("Navigating to new inquiries...");
          }}
          title="View Inquiries"
          className="cursor-pointer relative w-10 h-10 rounded-full flex items-center justify-center text-chrome/70 hover:bg-black/5 hover:text-chrome transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent-teal border border-primary animate-pulse"></span>
        </button>

        <div className="h-6 w-px bg-black/10 mx-1"></div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-chrome/70 hover:text-chrome transition-colors px-4 py-2 rounded-full bg-black/5 hover:bg-destructive border border-black/10 hover:border-destructive cursor-pointer group"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium hidden sm:block text-chrome group-hover:text-white">Logout</span>
        </button>
      </div>
    </header>
  );
}