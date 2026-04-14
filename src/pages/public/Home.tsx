import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ArrowRight, ShieldCheck, Headphones, TrendingUp, Loader2 } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { supabase } from "../../lib/supabase";

const DEFAULT_HERO_IMAGES = [
  "/hero-home-1.png",
  "/hero-home-2.png",
  "/hero-home-3.png",
  "/hero-home-4.png"
];

export default function Home() {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuredProperties, setFeaturedProperties] = useState<any[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const navigate = useNavigate();

  const displayImages = settings?.heroImages && settings.heroImages.length > 0 ? settings.heroImages : DEFAULT_HERO_IMAGES;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [displayImages.length]);

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoadingFeatured(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('featured', true)
          .neq('status', 'Inactive')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        
        const mappedProps = (data || []).map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          location: p.location?.address || 'Premium Location',
          price: p.price,
          specs: [p.bhk || 'N/A BHK', p.sq_ft || 'N/A sq.ft.', p.type || 'Residential'],
          level: p.level || 'Level A',
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
        }));
        setFeaturedProperties(mappedProps);
      } catch (error) {
        console.error("Failed to fetch featured properties:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    fetchFeaturedProperties();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/properties");
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0">
        {/* Background Carousel */}
        <div className="absolute inset-0 z-0">
          <img
            src={displayImages[currentImageIndex] || displayImages[0]}
            alt="Luxury Property"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Multi-layered Overlay for Maximum Contrast */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Enhanced Animated Gradient Mesh (Keep fixed across slides) */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15),transparent_60%)] animate-pulse"></div>
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(13,148,136,0.1),transparent_60%)] animate-pulse [animation-delay:1s]"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_60%)] animate-pulse [animation-delay:2s]"></div>
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-4xl md:text-7xl lg:text-8xl text-white tracking-tight mb-6"
          >
            Rise Above Ordinary Living
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-3xl mx-auto"
          >
            HTR properties brings you properties that elevate your lifestyle. Premium real estate, redefined with futuristic elegance and weightless luxury.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/properties" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-1">
              Explore Properties
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-8 py-4 rounded-full border border-accent-violet/50 bg-black/30 backdrop-blur-md text-white font-medium hover:bg-black/50 transition-all hover:-translate-y-1">
              Contact an Expert
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="mt-16 flex flex-wrap justify-center gap-6 sm:gap-12"
          >
            {["500+ Properties", "₹50Cr+ Deals Closed", "Since 2010"].map((stat, i) => (
              <div key={i} className="px-4 py-2 rounded-full border border-accent-teal/20 bg-accent-teal/5 backdrop-blur-md text-accent-teal text-sm font-mono tracking-widest uppercase">
                {stat}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Filter Bar */}
      <section className="relative z-20 -mt-16 px-4 max-w-6xl mx-auto w-full">
        <div className="glass-card rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-wrap lg:flex-nowrap gap-4 items-center justify-between">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-chrome/50" />
            <input
              type="text"
              placeholder="Search by location or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-black/5 border border-black/10 rounded-lg py-3 pl-10 pr-4 text-chrome focus:outline-none focus:border-accent-violet/50 transition-colors"
            />
          </div>

          <select className="bg-black/5 border border-accent-violet/20 rounded-lg py-3 px-4 text-chrome focus:outline-none focus:border-accent-violet/50 min-w-[140px]">
            <option>Buy</option>
            <option>Rent</option>
          </select>

          <select className="bg-black/5 border border-accent-violet/20 rounded-lg py-3 px-4 text-chrome focus:outline-none focus:border-accent-violet/50 min-w-[140px]">
            <option>All Levels</option>
            <option>Level A</option>
            <option>Level B</option>
            <option>Level C</option>
          </select>

          <select className="bg-black/5 border border-accent-violet/20 rounded-lg py-3 px-4 text-chrome focus:outline-none focus:border-accent-violet/50 min-w-[120px]">
            <option>Any BHK</option>
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
          </select>

          <button
            onClick={handleSearch}
            className="w-full lg:w-auto px-8 py-3 lg:py-4 rounded-lg bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
          >
            Search
          </button>
        </div>
      </section>

      {/* 3. Stats Section */}
      <section className="py-28 px-4 bg-secondary relative">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "500+", label: "Properties Listed" },
            { value: "15+", label: "Years of Excellence" },
            { value: "1,200+", label: "Families Housed" },
            { value: "98%", label: "Client Satisfaction" },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="font-serif text-5xl md:text-6xl text-chrome mb-2 group-hover:text-accent-teal transition-colors">
                {stat.value}
              </div>
              <div className="text-chrome/50 font-mono text-sm uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Properties Section */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16 border-b border-black/10 pb-4">
            <h2 className="font-serif text-4xl md:text-5xl text-chrome tracking-wide relative">
              Featured Listings
              <span className="absolute -bottom-4 left-0 w-24 h-[1px] bg-accent-violet"></span>
            </h2>
            <Link to="/properties" className="text-accent-teal hover:text-accent-violet transition-colors flex items-center gap-2 font-mono uppercase tracking-widest text-sm hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingFeatured ? (
              <div className="col-span-full flex justify-center py-12 text-chrome/60">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : featuredProperties.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-chrome/60">
                <p>No featured properties available at the moment.</p>
              </div>
            ) : featuredProperties.map((property) => (
              <div key={property.id} className="flex flex-col h-full bg-white border border-black/5 rounded-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
                <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-accent-violet/90 text-white font-mono text-xs uppercase tracking-widest rounded shadow-lg backdrop-blur-md">
                      Featured
                    </span>
                    <span className="px-3 py-1 bg-white/90 border border-accent-teal text-accent-teal font-mono text-xs uppercase tracking-widest rounded backdrop-blur-md shadow-sm">
                      {property.level}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-medium text-chrome mb-2">{property.title}</h3>
                      <p className="text-chrome/70 flex items-center gap-1 text-sm"><MapPin className="w-4 h-4 text-accent-violet shrink-0" /> {property.location}</p>
                    </div>
                  </div>
                  <div className="font-mono text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-violet to-accent-teal mb-4">
                    {property.price}
                  </div>
                  <div className="mt-auto pt-4 border-t border-accent-violet/10 mb-6">
                    <div className="flex items-center gap-4 text-sm text-chrome/80">
                      <span className="shrink-0">{property.specs[0]}</span>
                      <span className="w-1 h-1 shrink-0 rounded-full bg-accent-violet/50"></span>
                      <span className="shrink-0">{property.specs[1]}</span>
                      <span className="w-1 h-1 shrink-0 rounded-full bg-accent-violet/50"></span>
                      <span className="shrink-0">{property.specs[2]}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/properties/${property.slug}`} className="flex-1 text-center py-2.5 rounded-lg border border-accent-violet/50 hover:bg-accent-violet hover:text-white text-accent-violet transition-colors">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Why HTR properties */}
      <section className="py-28 px-4 bg-secondary border-y border-transparent relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-teal/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-chrome mb-6">HTR properties Advantage</h2>
            <p className="text-chrome/70 max-w-2xl mx-auto">Experiencing real estate without the usual friction. We streamline the extraordinary.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "Expert Market Knowledge", text: "Insights that place you ahead of the curve." },
              { icon: ShieldCheck, title: "100% Legal Verification", text: "Bulletproof safety for your peace of mind." },
              { icon: Headphones, title: "End-to-End Support", text: "White-glove service from viewing to deed." },
              { icon: TrendingUp, title: "Smart Investments", text: "Properties vetted for maximum appreciation." },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl hover:bg-black/5 transition-colors group">
                <div className="w-14 h-14 rounded-full bg-accent-violet/10 flex items-center justify-center mb-6 border border-accent-violet/20 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-accent-lavender" />
                </div>
                <h3 className="text-xl text-chrome mb-3 font-medium">{feature.title}</h3>
                <p className="text-chrome/60 leading-relaxed text-sm">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="py-32 px-4 relative overflow-hidden bg-primary">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-violet via-accent-lavender to-accent-teal opacity-5"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-white p-12 md:p-20 rounded-3xl border border-black/5 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
          <h2 className="font-serif text-4xl md:text-6xl text-chrome mb-6">Your Dream Property is One Call Away</h2>
          <p className="text-chrome/70 text-lg mb-10 max-w-2xl mx-auto">Connect with our executive advisors to begin your weightless journey into luxury real estate.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties" className="px-8 py-4 rounded-full bg-accent-violet text-white font-bold hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-1">
              Browse Properties
            </Link>
            {settings?.whatsapp && (
            <a href={settings.whatsapp} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-full border border-accent-violet/50 bg-white backdrop-blur-md text-accent-violet font-medium hover:bg-accent-violet hover:text-white transition-all hover:-translate-y-1">
              WhatsApp Us
            </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}