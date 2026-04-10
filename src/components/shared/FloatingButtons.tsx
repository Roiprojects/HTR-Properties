import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useSettings } from "../../contexts/SettingsContext";

export default function FloatingButtons() {
  const { settings } = useSettings();
  return (
    <div className="fixed z-50 left-6 bottom-6 flex flex-col gap-4">
      {/* Call Button */}
      <a
        href={`tel:${settings?.contactPhone.replace(/\\D/g, '') || '919886661254'}`}
        title="Call Us Now"
        className="group relative w-14 h-14 bg-gradient-to-r from-accent-violet to-accent-teal rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:scale-110 transition-transform duration-300"
      >
        <Phone className="w-6 h-6" />
        {/* Tooltip */}
        <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-secondary border border-accent-violet/30 text-white text-sm rounded-lg opacity-0 whitespace-nowrap group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Call Us Now
        </span>
      </a>

      {/* WhatsApp Button */}
      {settings?.whatsapp ? (
      <a
        href={settings.whatsapp}
        target="_blank"
        rel="noreferrer"
        title="Chat with us on WhatsApp"
        className="group relative w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:scale-110 transition-transform duration-300"
      >
        <div className="absolute inset-0 rounded-full border border-[#25D366] animate-ping opacity-75"></div>
        <FaWhatsapp className="w-7 h-7 relative z-10" />

        {/* Tooltip */}
        <span className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-secondary border border-[#25D366]/30 text-white text-sm rounded-lg opacity-0 whitespace-nowrap group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </a>
      ) : null}
    </div>
  );
}