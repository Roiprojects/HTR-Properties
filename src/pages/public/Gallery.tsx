import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Expand, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: string;
  status: string;
  created_at?: string;
}

const CATEGORIES = ["All", "Residential", "Commercial", "Interiors", "Exteriors", "Amenities"];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [dbImages, setDbImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .eq('status', 'Active')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDbImages(data || []);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const filteredImages = activeTab === "All" 
    ? dbImages 
    : dbImages.filter((img) => img.category === activeTab);

  const slides = filteredImages.map(img => ({ src: img.url }));

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-primary pb-20">
      <section className="pt-32 pb-16 px-4 text-center">
        <h1 className="font-serif text-4xl md:text-6xl text-chrome mb-6">Gallery</h1>
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
                : 'bg-secondary border border-black/10 text-chrome/60 hover:text-chrome hover:border-accent-violet/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="px-4 max-w-7xl mx-auto columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-chrome/40 space-y-4 col-span-full break-inside-avoid">
            <Loader2 className="w-10 h-10 animate-spin" />
            <p>Loading gallery items...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="flex justify-center py-20 text-chrome/50 text-lg col-span-full break-inside-avoid">
            No gallery items found.
          </div>
        ) : (
          filteredImages.map((img, index) => (
            <div 
              key={img.id || index} 
              className="break-inside-avoid relative group rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <img src={img.url} alt={img.title || "Gallery item"} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                <Expand className="w-8 h-8 text-white mb-2" />
                <span className="px-3 py-1 bg-white text-chrome font-mono text-xs uppercase tracking-widest rounded-full shadow-lg">
                  {img.category}
                </span>
              </div>
            </div>
          ))
        )}
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