import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { cn } from "../../lib/utils";
import logo from "../../assets/logo.jpg";
import { useSettings } from "../../contexts/SettingsContext";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  {
    name: "Properties",
    href: "/properties",
    dropdown: [
      { name: "Level A — Premium", href: "/properties/level-a" },
      { name: "Level B — Edition", href: "/properties/level-b" },
      { name: "Level C — Essential", href: "/properties/level-c" },
    ]
  },
  { name: "Gallery", href: "/gallery" },
  { name: "Testimonials", href: "/testimonials" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const { settings } = useSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const linkColorClass = "text-chrome hover:text-accent-violet";

  return (
    <>
      <nav
        className={cn(
          "fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-500 w-[95%] xl:w-full max-w-7xl rounded-[2.5rem] px-4",
          isScrolled ? "top-2 py-0 shadow-xl bg-[#FBFDFA]/95" : "top-6 py-1 shadow-lg bg-[#FBFDFA]",
          "backdrop-blur-lg border border-black/5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group logo-container"
          >
            <div className="logo-glow">
              <img src={logo} alt="HTR Properties" className="h-14 w-auto object-contain relative z-10" />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {NAV_LINKS.map((link) => (
              <div key={link.name} className="relative group" onMouseLeave={() => link.dropdown && setDropdownOpen(false)}>
                {link.dropdown ? (
                  <button
                    className={cn("flex items-center gap-1 transition-colors py-2 font-medium", linkColorClass)}
                    onMouseEnter={() => setDropdownOpen(true)}
                  >
                    {link.name} <ChevronDown className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    onClick={() => link.href === "/" && window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className={cn("transition-colors py-2 font-medium relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-accent-teal hover:after:w-full after:transition-all after:duration-300", linkColorClass)}
                  >
                    {link.name}
                  </Link>
                )}

                {/* Dropdown */}
                {link.dropdown && dropdownOpen && (
                  <div className="absolute top-full left-0 w-56 pt-2 pb-2 bg-secondary/95 backdrop-blur-md border border-accent-violet/20 rounded-lg shadow-2xl overflow-hidden glass-card">
                    {link.dropdown.map((subItem) => (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className="block px-4 py-3 text-sm text-chrome hover:text-accent-violet hover:bg-accent-violet/5 transition-colors"
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {settings?.whatsapp && (
            <a
              href={settings.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-[#25D366]/20 text-[#4ade80] hover:bg-[#25D366] hover:text-white transition-all hover:scale-110 shadow-[0_0_20px_rgba(37,211,102,0.5)] drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]"
            >
              <FaWhatsapp className="w-5 h-5" />
            </a>
            )}
            <Link
              to="/contact"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all hover:-translate-y-0.5"
            >
              Book Visit
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-chrome hover:text-accent-teal transition-colors"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
      </nav>

      {/* Mobile Drawer */}
      {createPortal(
        <div
          className={cn(
            "fixed inset-0 z-[100] bg-primary/98 backdrop-blur-2xl transition-transform duration-300 lg:hidden flex flex-col",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
        <div className="flex justify-between items-center p-6 border-b border-accent-violet/10">
          <div className="logo-container">
            <div className="logo-glow">
              <img src={logo} alt="HTR Properties" className="h-12 w-auto object-contain relative z-10" />
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="text-chrome hover:text-accent-teal">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-8 px-6 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <div key={link.name} className="flex flex-col gap-4">
              {link.dropdown ? (
                <>
                  <div className="text-chrome/50 font-mono text-xs tracking-widest uppercase">{link.name}</div>
                  <div className="flex flex-col gap-4 pl-4 border-l border-accent-violet/10">
                    {link.dropdown.map(subItem => (
                      <Link key={subItem.name} to={subItem.href} className="text-xl text-chrome font-medium">
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={link.href}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (link.href === "/") window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-2xl text-chrome font-medium hover:text-accent-violet transition-colors"
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-accent-violet/20 flex flex-col gap-4">
          <Link
            to="/contact"
            className="w-full py-4 text-center rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium text-lg"
          >
            Book Visit
          </Link>
        </div>
      </div>,
      document.body
      )}
    </>
  );
}