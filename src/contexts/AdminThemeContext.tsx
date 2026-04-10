import React, { createContext, useContext, useEffect, useState } from "react";

interface AdminThemeContextType {
  isDark: boolean;
  toggleDark: () => void;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("admin-theme-dark");
    return saved === "true" || false;
  });

  useEffect(() => {
    localStorage.setItem("admin-theme-dark", String(isDark));
  }, [isDark]);

  const toggleDark = () => setIsDark(prev => !prev);

  return (
    <AdminThemeContext.Provider value={{ isDark, toggleDark }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");
  }
  return context;
}
