import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Filter, Search, MapPin } from "lucide-react";

export default function Properties() {
  const { pathname } = useLocation();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Determine Level from URL
  let levelName = "All Premium Properties";
  let levelTagline = "Discover our entire curated collection.";
  if (pathname.includes("level-a")) {
    levelName = "Level A — Premium";
    levelTagline = "Only the absolute finest in luxury real estate.";
  } else if (pathname.includes("level-b")) {
    levelName = "Level B — Edition";
    levelTagline = "Exquisite properties for the discerning buyer.";
  } else if (pathname.includes("level-c")) {
    levelName = "Level C — Essential";
    levelTagline = "The perfect entry into weightless luxury.";
  }

  // Mock Property Data
  const ALL_PROPERTIES = [
    { id: 1, title: "Skyline Penthouse", location: "MG Road, Bangalore", price: "₹4.2 Cr", specs: ["3 BHK", "2,400 sq.ft.", "Residential"], level: "Level A", image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800" },
    { id: 2, title: "Zenith Villa", location: "Banjara Hills, Hyderabad", price: "₹8.5 Cr", specs: ["5 BHK", "6,000 sq.ft.", "Villa"], level: "Level A", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" },
    { id: 3, title: "Aura Residences", location: "Worli, Mumbai", price: "₹12.0 Cr", specs: ["4 BHK", "4,500 sq.ft.", "Sea View"], level: "Level A", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800" },
    { id: 4, title: "Lumina Apartments", location: "Koregaon Park, Pune", price: "₹2.8 Cr", specs: ["2 BHK", "1,500 sq.ft.", "Residential"], level: "Level B", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800" },
    { id: 5, title: "Oasis Flats", location: "Andheri West, Mumbai", price: "₹3.5 Cr", specs: ["3 BHK", "1,800 sq.ft.", "Residential"], level: "Level B", image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=800" },
    { id: 6, title: "Terra Condos", location: "Salt Lake, Kolkata", price: "₹1.5 Cr", specs: ["2 BHK", "1,200 sq.ft.", "Residential"], level: "Level C", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800" },
    { id: 7, title: "Nova Suites", location: "Gachibowli, Hyderabad", price: "₹1.2 Cr", specs: ["1 BHK", "900 sq.ft.", "Studio"], level: "Level C", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" },
  ];

  // Filter based on path
  const filteredProperties = ALL_PROPERTIES.filter(prop => {
    if (pathname.includes("level-a")) return prop.level === "Level A";
    if (pathname.includes("level-b")) return prop.level === "Level B";
    if (pathname.includes("level-c")) return prop.level === "Level C";
    return true; // "All" properties route
  });

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      {/* Header Banner */}
      <section className="relative pt-32 pb-16 px-4 border-b border-accent-violet/20 bg-secondary/50">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <span className="px-4 py-1.5 mb-6 bg-accent-violet/10 border border-accent-violet/30 text-accent-violet font-mono text-sm tracking-widest uppercase rounded-full">
            {filteredProperties.length} Properties Available
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-4">
            {levelName}
          </h1>
          <p className="text-chrome/70 text-lg max-w-2xl">{levelTagline}</p>
        </div>
      </section>

      {/* Main Content: Two Columns */}
      <section className="py-12 px-4 flex-1">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center mb-4">
            <span className="text-white font-serif text-xl">Filters</span>
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-white"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* LEFT: Filter Sidebar */}
          <aside className={`lg:w-80 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="glass-card rounded-2xl p-6 sticky top-28 border border-accent-violet/20">
              <h3 className="text-white font-mono text-lg tracking-widest uppercase mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent-teal" /> Refine Search
              </h3>

              <div className="flex flex-col gap-6">
                {/* Search */}
                <div>
                  <label className="text-chrome/70 text-sm mb-2 block">Keywords / Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome/50" />
                    <input type="text" placeholder="Search..." className="w-full bg-primary/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white text-sm focus:border-accent-violet/50 outline-none" />
                  </div>
                </div>

                {/* Listing Type / Property Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-chrome/70 text-sm mb-2 block">Purpose</label>
                    <select className="w-full bg-primary/50 border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm outline-none">
                      <option>Any</option><option>Buy</option><option>Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-chrome/70 text-sm mb-2 block">Type</label>
                    <select className="w-full bg-primary/50 border border-white/10 rounded-lg py-2.5 px-3 text-white text-sm outline-none">
                      <option>Any</option><option>Resid.</option><option>Comm.</option>
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-chrome/70 text-sm mb-2 block flex justify-between">
                    <span>Max Price</span>
                    <span className="text-accent-teal font-mono">₹10 Cr</span>
                  </label>
                  <input type="range" min="10" max="5000" className="w-full relative z-10 accent-accent-violet appearance-none h-1 bg-white/10 rounded-full" />
                </div>

                {/* BHK */}
                <div>
                  <label className="text-chrome/70 text-sm mb-3 block">BHK Configuration</label>
                  <div className="flex flex-wrap gap-2">
                    {["1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map(bhk => (
                      <label key={bhk} className="flex items-center gap-2 text-sm text-chrome cursor-pointer">
                        <input type="checkbox" className="w-4 h-4 accent-accent-violet rounded" /> {bhk}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
                  <button className="w-full py-3 rounded-lg bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
                    Apply Filters
                  </button>
                  <button className="w-full py-3 rounded-lg border border-white/10 text-chrome/70 hover:text-white hover:bg-white/5 transition-colors text-sm">
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT: Properties Grid */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <p className="text-chrome/70">Showing <span className="text-white font-medium">{filteredProperties.length}</span> properties</p>
              <div className="flex items-center gap-3">
                <span className="text-chrome/70 text-sm">Sort by:</span>
                <select className="bg-secondary border border-white/10 rounded-lg py-1.5 px-3 text-white text-sm outline-none">
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {filteredProperties.map((property) => (
                <div key={property.id} className="flex flex-col h-full glass-card rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                       <span className="px-2.5 py-1 bg-primary/80 border border-accent-teal text-accent-teal font-mono text-xs uppercase tracking-widest rounded shadow-lg backdrop-blur-md">
                        {property.level}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow p-5">
                    <h3 className="text-lg font-medium text-white mb-1">{property.title}</h3>
                    <p className="text-chrome/60 flex items-center gap-1 text-sm mb-4"><MapPin className="w-3 h-3 text-accent-violet shrink-0" /> {property.location}</p>
                    
                    <div className="font-mono text-xl font-bold text-accent-lavender mb-4">
                      {property.price}
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex gap-2 text-xs text-chrome/70 mb-5">
                        <span className="px-2 py-1 bg-white/5 rounded shrink-0">{property.specs[0]}</span>
                        <span className="px-2 py-1 bg-white/5 rounded shrink-0">{property.specs[1]}</span>
                        <span className="px-2 py-1 bg-white/5 rounded shrink-0">{property.specs[2]}</span>
                      </div>
                      
                      <Link to="/properties/elysium-residences" className="block w-full text-center py-2.5 rounded-lg border border-accent-violet/30 hover:bg-accent-violet/10 text-white transition-colors text-sm font-medium">
                        Explore Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3].map(page => (
                <button key={page} className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono ${page === 1 ? 'bg-accent-violet text-white' : 'bg-secondary border border-white/10 text-chrome hover:bg-white/5'}`}>
                  {page}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}