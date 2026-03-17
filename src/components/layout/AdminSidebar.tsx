import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Home, 
  Image as ImageIcon, 
  MessageSquare, 
  Mail, 
  BarChart, 
  Settings,
  ShieldAlert
} from "lucide-react";
import { cn } from "../../lib/utils";
import logo from "../../assets/logo.jpg";

const ADMIN_LINKS = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Properties", href: "/admin/properties", icon: Home },
  { name: "Level A Listings", href: "/admin/properties?level=a", icon: ShieldAlert },
  { name: "Level B Listings", href: "/admin/properties?level=b", icon: ShieldAlert },
  { name: "Level C Listings", href: "/admin/properties?level=c", icon: ShieldAlert },
  { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Leads & Inquiries", href: "/admin/leads", icon: Mail },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ isMobileOpen, onClose }: { isMobileOpen?: boolean; onClose?: () => void }) {
  const { pathname } = useLocation();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-primary/80 backdrop-blur-sm z-[90] lg:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-[100] w-64 bg-[#0F0F1A] border-r border-accent-violet/20 flex flex-col transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center px-6 border-b border-white/5">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={logo} alt="HTR Properties" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3 custom-scrollbar">
          <p className="px-3 text-xs font-mono text-chrome/40 uppercase tracking-widest mb-2">Management</p>
          {ADMIN_LINKS.map(link => {
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/admin");
            return (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors border border-transparent",
                  isActive 
                    ? "bg-accent-violet/10 text-white border-l-4 border-l-accent-violet border-y-accent-violet/20 border-r-accent-violet/20" 
                    : "text-chrome/60 hover:text-white hover:bg-white/5"
                )}
              >
                <link.icon className={cn("w-5 h-5", isActive ? "text-accent-teal" : "")} />
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-10 h-10 rounded-full bg-accent-violet/20 border border-accent-violet flex items-center justify-center text-accent-violet font-bold">
              AD
            </div>
            <div>
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-chrome/50 text-xs text-ellipsis overflow-hidden">admin@antigravity.in</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}