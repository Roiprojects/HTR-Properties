import { useState, useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Filter, Search, MapPin, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export default function Properties() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const [purpose, setPurpose] = useState(searchParams.get("purpose") || "Any");
  const [propertyType, setPropertyType] = useState("Any");
  const [maxPrice, setMaxPrice] = useState(500); // 500 Cr as default high
  const [selectedBHKs, setSelectedBHKs] = useState<string[]>([]);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("All");
  const POSTS_PER_PAGE = 6;
  
  // Applied status
  const [activeFilters, setActiveFilters] = useState({
    keyword: searchParams.get("search") || "",
    purpose: searchParams.get("purpose") || "Any",
    propertyType: "Any",
    maxPrice: 500,
    bhks: [] as string[]
  });

  const handleApplyFilters = () => {
    setActiveFilters({
      keyword,
      purpose,
      propertyType,
      maxPrice,
      bhks: selectedBHKs
    });
    setIsMobileFilterOpen(false);
  };

  const handleReset = () => {
    setKeyword("");
    setPurpose("Any");
    setPropertyType("Any");
    setMaxPrice(500);
    setSelectedBHKs([]);
    setActiveFilters({
      keyword: "",
      purpose: "Any",
      propertyType: "Any",
      maxPrice: 500,
      bhks: []
    });
  };

  const toggleBHK = (bhk: string) => {
    setSelectedBHKs(prev => prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]);
  };

  // Adjust max price when purpose changes to Rent
  useEffect(() => {
    if (purpose === "Rent" && maxPrice > 10) {
      setMaxPrice(10);
    }
  }, [purpose]);

  // Determine Level from URL
  let levelName = "All Properties";
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

  // Dynamic Property Data
  const [dbProperties, setDbProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .neq('status', 'Inactive')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Map database properties to the structure expected by the UI
        const mappedProps = (data || []).map(p => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          location: p.location?.address || 'Premium Location',
          price: parseFloat(p.price.replace(/[^\d.]/g, '')) || 0, // Extract number for filtering
          priceStr: p.price,
          specs: [p.bhk || 'N/A BHK', p.sq_ft || 'N/A sq.ft.', p.type || 'Residential'],
          level: p.level || 'Level A',
          type: p.type || 'Residential',
          purpose: p.purpose || 'Buy',
          featured: p.featured || false,
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'
        }));
        setDbProperties(mappedProps);
      } catch (error) {
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Reset pagination when filters or pathname changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilters, pathname, sortBy]);

  // Filter based on path and applied filters
  const filteredProperties = dbProperties.filter(prop => {
    // Path filter
    const matchesPath = pathname.includes("level-a") ? prop.level === "Level A" :
                        pathname.includes("level-b") ? prop.level === "Level B" :
                        pathname.includes("level-c") ? prop.level === "Level C" : true;

    // Keyword filter
    const matchesSearch = activeFilters.keyword ? 
      prop.title.toLowerCase().includes(activeFilters.keyword.toLowerCase()) || 
      prop.location.toLowerCase().includes(activeFilters.keyword.toLowerCase()) : true;

    // Purpose filter
    const matchesPurpose = activeFilters.purpose === "Any" || prop.purpose === activeFilters.purpose;

    // Type filter
    const matchesType = activeFilters.propertyType === "Any" || prop.type === activeFilters.propertyType;

    // Price filter
    const matchesPrice = prop.price <= activeFilters.maxPrice;

    // BHK filter
    const matchesBHK = activeFilters.bhks.length === 0 || 
      activeFilters.bhks.includes(prop.specs[0]) || 
      (activeFilters.bhks.includes("4+ BHK") && parseInt(prop.specs[0]) >= 4);

    return matchesPath && matchesSearch && matchesPurpose && matchesType && matchesPrice && matchesBHK;
  });

  // Calculate Paginated Data
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return 0;
  });

  const totalPages = Math.ceil(sortedProperties.length / POSTS_PER_PAGE);
  const paginatedProperties = sortedProperties.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary">
      {/* Header Banner */}
      <section className="relative pt-32 pb-16 px-4 border-b border-accent-violet/20 bg-secondary/50">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-chrome mb-4">
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
            <span className="text-chrome font-serif text-xl">Filters</span>
            <button 
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="p-2 bg-black/5 border border-black/10 rounded-lg text-chrome"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* LEFT: Filter Sidebar */}
          <aside className={`lg:w-80 flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="glass-card rounded-2xl p-6 sticky top-28 border border-black/10 shadow-sm">
              <h3 className="text-chrome font-mono text-lg tracking-widest uppercase mb-6 flex items-center gap-2">
                <Filter className="w-5 h-5 text-accent-teal" /> Refine Search
              </h3>

              <div className="flex flex-col gap-6">
                {/* Search */}
                <div>
                  <label className="text-chrome/70 text-sm mb-2 block">Keywords / Location</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome/50" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      className="w-full bg-black/5 border border-black/10 rounded-lg py-2.5 pl-10 pr-4 text-chrome text-sm focus:border-accent-violet/50 outline-none" 
                    />
                  </div>
                </div>

                {/* Listing Type / Property Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-chrome/70 text-sm mb-2 block">Purpose</label>
                    <select 
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-black/5 border border-black/10 rounded-lg py-2.5 px-3 text-chrome text-sm outline-none"
                    >
                      <option>Any</option><option>Buy</option><option>Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-chrome/70 text-sm mb-2 block">Type</label>
                    <select 
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-black/5 border border-black/10 rounded-lg py-2.5 px-3 text-chrome text-sm outline-none"
                    >
                      <option>Any</option><option>Resid.</option><option>Comm.</option>
                    </select>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-chrome/70 text-sm mb-2 block flex justify-between">
                    <span>Max Price</span>
                    <span className="text-accent-teal font-mono">₹{maxPrice} {purpose === "Rent" ? "Lakh" : "Cr"}</span>
                  </label>
                  <input 
                    type="range" 
                    min="1" 
                    max={purpose === "Rent" ? "10" : "500"} 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full relative z-10 accent-accent-violet appearance-none h-1 bg-black/10 rounded-full" 
                  />
                </div>

                {/* BHK */}
                <div>
                  <label className="text-chrome/70 text-sm mb-3 block">BHK Configuration</label>
                  <div className="flex flex-wrap gap-2">
                    {["1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map(bhk => (
                      <label key={bhk} className="flex items-center gap-2 text-sm text-chrome cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedBHKs.includes(bhk)}
                          onChange={() => toggleBHK(bhk)}
                          className="w-4 h-4 accent-accent-violet rounded" 
                        /> {bhk}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Buttons */}
                <div className="pt-4 border-t border-black/10 flex flex-col gap-3">
                  <button 
                    onClick={handleApplyFilters}
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all"
                  >
                    Apply Filters
                  </button>
                  <button 
                    onClick={handleReset}
                    className="w-full py-3 rounded-lg border border-black/10 text-chrome/70 hover:text-chrome hover:bg-black/5 transition-colors text-sm"
                  >
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
              <p className="text-chrome/70">
                Showing <span className="text-chrome font-medium">
                  {paginatedProperties.length > 0 ? (currentPage - 1) * POSTS_PER_PAGE + 1 : 0}
                </span>–<span className="text-chrome font-medium">
                  {Math.min(currentPage * POSTS_PER_PAGE, filteredProperties.length)}
                </span> of <span className="text-chrome font-medium">{filteredProperties.length}</span> properties
              </p>
              <div className="flex items-center gap-3">
                <span className="text-chrome/70 text-sm">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-secondary border border-black/10 rounded-lg py-1.5 px-3 text-chrome text-sm outline-none"
                >
                  <option>All</option>
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-chrome/40 space-y-4 col-span-full">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p>Loading premium properties...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 col-span-full text-center">
                <p className="text-chrome/60 text-lg">No properties found matching your criteria.</p>
                <button onClick={handleReset} className="mt-4 text-accent-violet hover:underline">Clear filters</button>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {paginatedProperties.map((property) => (
                <div key={property.id} className="flex flex-col h-full bg-white border border-black/5 rounded-2xl overflow-hidden group hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                       <span className="px-2.5 py-1 bg-white/90 border border-accent-teal text-accent-teal font-mono text-xs uppercase tracking-widest rounded shadow-sm backdrop-blur-md">
                        {property.level}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-grow p-5">
                    <h3 className="text-lg font-medium text-chrome mb-1">{property.title}</h3>
                    <p className="text-chrome/60 flex items-center gap-1 text-sm mb-4"><MapPin className="w-3 h-3 text-accent-violet shrink-0" /> {property.location}</p>
                    
                    <div className="font-mono text-xl font-bold text-accent-lavender mb-4">
                      {property.priceStr}
                    </div>
                    
                    <div className="mt-auto">
                      <div className="flex gap-2 text-xs text-chrome/70 mb-5">
                        <span className="px-2 py-1 bg-black/5 rounded shrink-0">{property.specs[0]}</span>
                        <span className="px-2 py-1 bg-black/5 rounded shrink-0">{property.specs[1]}</span>
                        <span className="px-2 py-1 bg-black/5 rounded shrink-0">{property.specs[2]}</span>
                      </div>
                      
                      <Link to={`/properties/${property.slug}`} className="block w-full text-center py-2.5 rounded-lg border border-accent-violet/30 hover:bg-accent-violet hover:text-white text-accent-violet transition-colors text-sm font-medium">
                        Explore Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page} 
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono transition-all ${
                      page === currentPage 
                        ? 'bg-accent-violet text-white shadow-lg shadow-accent-violet/20' 
                        : 'bg-secondary border border-black/10 text-chrome hover:bg-black/5 hover:text-chrome'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}