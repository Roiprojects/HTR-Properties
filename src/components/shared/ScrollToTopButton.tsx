import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!showScrollTop) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed z-50 right-6 bottom-6 w-12 h-12 bg-accent-violet rounded-full flex items-center justify-center text-white shadow-[0_0_15px_rgba(124,58,237,0.6)] hover:bg-accent-teal hover:shadow-[0_0_20px_rgba(45,212,191,0.6)] hover:scale-110 transition-all duration-300"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-6 h-6" />
    </button>
  );
}
