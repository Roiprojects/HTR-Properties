import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Expand } from "lucide-react";

const GALLERY_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800", category: "Exteriors" },
  { id: 2, url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800", category: "Interiors" },
  { id: 3, url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800", category: "Amenities" },
  { id: 4, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800", category: "Residential" },
  { id: 5, url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800", category: "Interiors" },
  { id: 6, url: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800", category: "Commercial" },
  { id: 7, url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800", category: "Commercial" },
];

const CATEGORIES = ["All", "Residential", "Commercial", "Interiors", "Exteriors", "Amenities"];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = activeTab === "All" 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === activeTab);

  const slides = filteredImages.map(img => ({ src: img.url }));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-primary pb-20">
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="font-serif text-4xl md:text-6xl text-white mb-6">Gallery</h1>
        <p className="text-chrome/70 text-lg max-w-2xl mx-auto mb-12">
          A visual journey through spaces where architecture defies gravity and imagination knows no bounds.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-4xl mx-auto">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2 rounded-full font-mono text-sm uppercase tracking-widest transition-all ${
                activeTab === cat 
                ? 'bg-accent-violet text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]' 
                : 'bg-secondary border border-white/10 text-chrome/60 hover:text-white hover:border-accent-violet/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="px-4 max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredImages.map((img, index) => (
          <div 
            key={img.id} 
            className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <img src={img.url} alt="Gallery item" className="w-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
              <Expand className="w-8 h-8 text-white mb-2" />
              <span className="px-3 py-1 bg-accent-teal/20 text-accent-teal font-mono text-xs uppercase tracking-widest rounded shadow-lg backdrop-blur-md">
                {img.category}
              </span>
            </div>
          </div>
        ))}
      </section>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={currentIndex}
        slides={slides}
      />
    </div>
  );
}