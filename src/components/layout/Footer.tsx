import { Link } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { FaInstagram, FaFacebook, FaYoutube, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { useSettings } from "../../contexts/SettingsContext";

export default function Footer() {
  const { settings } = useSettings();
  return (
    <footer className="bg-transparent pt-20 pb-8 border-t border-black/10 relative overflow-hidden">
      {/* Top subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent-violet to-transparent opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2 logo-container w-fit">
              <div className="logo-glow">
                <img src={logo} alt="HTR Properties" className="h-10 w-auto object-contain relative z-10" />
              </div>
            </Link>
            <p className="text-chrome/60 leading-relaxed">
              We bring you properties that elevate your lifestyle. Premium real estate, redefined with gravity-defying architecture and unrestricted luxury.
            </p>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-chrome font-mono text-sm tracking-widest uppercase mb-2">Company</h4>
            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-chrome/60 hover:text-accent-teal transition-colors w-fit"
            >
              Home
            </Link>
            <Link to="/about" className="text-chrome/60 hover:text-accent-teal transition-colors w-fit">About Us</Link>
            <Link to="/contact" className="text-chrome/60 hover:text-accent-teal transition-colors w-fit">Contact</Link>
            <Link to="/admin/login" className="text-chrome/40 hover:text-accent-violet transition-colors w-fit text-sm mt-2">Admin Login</Link>
          </div>

          {/* Properties Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-chrome font-mono text-sm tracking-widest uppercase mb-2">Properties</h4>
            <Link to="/properties/level-a" className="text-chrome/60 hover:text-accent-teal transition-colors w-fit">Level A — Premium</Link>
            <Link to="/properties/level-b" className="text-chrome/60 hover:text-accent-teal transition-colors w-fit">Level B — Edition</Link>
            <Link to="/properties/level-c" className="text-chrome/60 hover:text-accent-teal transition-colors w-fit">Level C — Essential</Link>
            <Link to="/gallery" className="text-chrome/60 hover:text-accent-teal transition-colors w-fit">Gallery View</Link>
          </div>

          {/* Contact Col */}
          <div className="flex flex-col gap-4">
            <h4 className="text-chrome font-mono text-sm tracking-widest uppercase mb-2">Reach Out</h4>
            <a href={`tel:${settings?.contactPhone.replace(/\\D/g, '')}`} className="text-chrome/60 hover:text-accent-violet transition-colors w-fit">{settings?.contactPhone || 'Phone'}</a>
            <a href={settings?.whatsapp} className="text-chrome/60 hover:text-[#0D9488] transition-colors w-fit">WhatsApp Us</a>
            <a href={`mailto:${settings?.contactEmail}`} className="text-chrome/60 hover:text-accent-violet transition-colors w-fit">{settings?.contactEmail || 'Email'}</a>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.address || '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-chrome/60 hover:text-accent-violet transition-colors mt-2 block whitespace-pre-line"
            >
              {settings?.address || 'Address'}
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
          HTR Properties © 2026. All rights reserved.<a
            href="https://wa.me/919945379333"
            target="_blank"
            rel="noopener noreferrer"
            className="text-chrome/40 text-sm hover:text-accent-teal transition-colors focus-visible:outline-none"
          >
            Developed by ROI infotech
          </a>

          <div className="flex items-center gap-4 text-chrome/40">
            {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-accent-violet transition-colors p-2"><FaInstagram className="w-5 h-5" /></a>}
            {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-accent-violet transition-colors p-2"><FaFacebook className="w-5 h-5" /></a>}
            {settings?.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-accent-violet transition-colors p-2"><FaYoutube className="w-5 h-5" /></a>}
            {settings?.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-accent-violet transition-colors p-2"><FaLinkedin className="w-5 h-5" /></a>}
            {settings?.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-accent-violet transition-colors p-2"><FaXTwitter className="w-5 h-5" /></a>}
          </div>
        </div>
      </div>
    </footer>
  );
}