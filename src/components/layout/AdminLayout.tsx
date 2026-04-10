import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { AdminThemeProvider, useAdminTheme } from "../../contexts/AdminThemeContext";

function AdminLayoutContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDark } = useAdminTheme();

  return (
    <div className={`min-h-screen flex transition-colors duration-300 bg-secondary text-chrome font-sans ${isDark ? 'admin-dark' : ''}`}>
      <AdminSidebar isMobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AdminThemeProvider>
      <AdminLayoutContent />
    </AdminThemeProvider>
  );
}
