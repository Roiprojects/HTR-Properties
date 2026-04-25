import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";

import { MapPin, Box, ArrowLeft, CheckCircle, Bed, Maximize, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useSettings } from "../../contexts/SettingsContext";

interface Property {
  id: string;
  title: string;
  slug: string;
  level: string;
  type: string;
  bhk: string;
  sq_ft?: string;
  price: string;
  status: string;
  images: string[];
  description?: string;
  amenities?: string[];
  location?: { address?: string };
  created_at: string;
  purpose?: string;
}

const MOCK_PROPERTIES: Property[] = [
  { id: "1", title: "Skyline Penthouse", slug: "skyline-penthouse", level: "Level A", type: "Residential", bhk: "3 BHK", price: "₹4.2 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600"], created_at: new Date().toISOString() },
  { id: "2", title: "Celestial Suites", slug: "celestial-suites", level: "Level A", type: "Ultra Luxury", bhk: "4 BHK", price: "₹8.5 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "3", title: "Majestic Heights", slug: "majestic-heights", level: "Level A", type: "Premium", bhk: "5 BHK", price: "₹12.0 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "4", title: "Silicon Valley Villas", slug: "silicon-valley-villas", level: "Level B", type: "Corporate Hub", bhk: "3 BHK", price: "₹3.5 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "5", title: "Lakeside Manor", slug: "lakeside-manor", level: "Level A", type: "Lake View", bhk: "4 BHK", price: "₹6.8 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "6", title: "Prestige Gardenia", slug: "prestige-gardenia", level: "Level B", type: "Classic Luxury", bhk: "3 BHK", price: "₹5.2 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "7", title: "Luminous Estates", slug: "luminous-estates", level: "Level A", type: "Garden View", bhk: "4 BHK", price: "₹5.5 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "8", title: "Azure Towers", slug: "azure-towers", level: "Level B", type: "Cyber City View", bhk: "2 BHK", price: "₹2.8 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "9", title: "Serene Enclave", slug: "serene-enclave", level: "Level A", type: "Private Pool", bhk: "4 BHK", price: "₹7.2 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "10", title: "Metro Elegance", slug: "metro-elegance", level: "Level B", type: "Heritage Area", bhk: "3 BHK", price: "₹4.5 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "11", title: "Oakwood Residency", slug: "oakwood-residency", level: "Level B", type: "Green Living", bhk: "3 BHK", price: "₹3.9 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
  { id: "12", title: "Royal Palms", slug: "royal-palms", level: "Level A", type: "VVIP Villa", bhk: "6 BHK", price: "₹18.0 Cr", status: "Active", images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800"], created_at: new Date().toISOString() },
];

export default function PropertyDetail() {
  const { settings } = useSettings();
  const { slug } = useParams();
  const [activeTab, setActiveTab] = useState("description");
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("properties")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error || !data) {
          // Fallback to mock data if not found in db
          const mockMatch = MOCK_PROPERTIES.find(p => p.slug === slug);
          if (mockMatch) {
            setProperty(mockMatch);
          } else {
            setProperty(null);
          }
        } else {
          setProperty(data);
        }
      } catch (err) {
        console.error(err);
        const mockMatch = MOCK_PROPERTIES.find(p => p.slug === slug);
        setProperty(mockMatch || null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProperty();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent-violet animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-primary flex flex-col items-center justify-center text-chrome">
        <h1 className="text-4xl font-serif mb-4">Property Not Found</h1>
        <p className="mb-8 text-chrome/60">We couldn't find the property you're looking for.</p>
        <Link to="/properties" className="px-6 py-3 bg-accent-violet text-white rounded-lg hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
          Browse All Properties
        </Link>
      </div>
    );
  }

  // Determine fallback amenities/description if strictly necessary
  const amenitiesList = property.amenities && property.amenities.length > 0
    ? property.amenities
    : ["Infinity Pool", "24/7 Concierge", "Smart Home", "Fitness Center"];

  // Get safe images array ensuring at least 1-4 images exist for layout
  const propImages = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200"];

  const image1 = propImages[0];
  const image2 = propImages.length > 1 ? propImages[1] : propImages[0];
  const image3 = propImages.length > 2 ? propImages[2] : image2;
  const image4 = propImages.length > 3 ? propImages[3] : image3;

  const whatsappMessage = encodeURIComponent(`Hi HTR properties, I'm interested in scheduling a tour for ${property.title}.`);

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* 1. Gallery Section */}
      <section className="h-[60vh] md:h-[75vh] w-full relative grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 p-2 pt-20 md:pt-32">
        <div className="md:col-span-2 row-span-2 relative group overflow-hidden rounded-xl bg-black/5">
          <img src={image1} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Main" />
          <Link to="/properties" className="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-accent-violet transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
        <div className="hidden md:block overflow-hidden rounded-xl relative group bg-black/5">
          <img src={image2} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Room 1" />
        </div>
        <div className="hidden md:block overflow-hidden rounded-xl relative group bg-black/5">
          <img src={image3} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Room 2" />
        </div>
        <div className="hidden md:block overflow-hidden rounded-xl relative group bg-black/5">
          <img src={image4} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Room 3" />
        </div>
        <div className="hidden md:block overflow-hidden rounded-xl relative group cursor-pointer bg-black/5">
          <img src={propImages.length > 4 ? propImages[4] : image4} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Room 4" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="flex items-center gap-2 text-white font-medium border border-white/30 px-4 py-2 rounded-full glass-card">
              <Maximize className="w-4 h-4" /> View All Photos ({propImages.length})
            </span>
          </div>
        </div>
      </section>

      {/* 2. Content Section */}
      <section className="max-w-7xl mx-auto px-4 mt-8 flex flex-col lg:flex-row gap-12">
        {/* LEFT COMPONENT */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {property.purpose && (
                <span className="px-3 py-1 bg-accent-lavender/10 text-accent-violet font-mono border border-accent-violet/30 rounded-md text-xs tracking-widest uppercase">For {property.purpose}</span>
              )}
              <span className="px-3 py-1 bg-accent-violet/10 text-accent-violet font-mono border border-accent-violet/30 rounded-md text-xs tracking-widest uppercase">{property.status}</span>
              <span className="px-3 py-1 bg-accent-teal/10 text-accent-teal font-mono border border-accent-teal/30 rounded-md text-xs tracking-widest uppercase">{property.level}</span>
              <span className="px-3 py-1 bg-black/5 text-chrome font-mono border border-black/10 rounded-md text-xs tracking-widest uppercase">{property.type}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-chrome mb-2">{property.title}</h1>
            <p className="text-chrome/60 flex items-center gap-2 text-lg">
              <MapPin className="w-5 h-5 text-accent-violet shrink-0" />
              {property.location?.address || "Premium Location, Bengaluru"}
            </p>
          </div>

          <div className="text-3xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal mb-10 pb-10 border-b border-black/10">
            {property.price}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Bed, val: property.bhk || "BHK" },
              { icon: Box, val: property.type },
              { icon: Maximize, val: property.sq_ft || "Area N/A" },
              { icon: CheckCircle, val: "Verified status" },
            ].map((stat, i) => (
              <div key={i} className="bg-black/5 border border-black/5 rounded-2xl p-4 flex flex-col gap-2 items-center text-center">
                <stat.icon className="w-6 h-6 text-accent-lavender" />
                <span className="text-chrome font-medium text-sm">{stat.val}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-black/10 mb-8 overflow-x-auto no-scrollbar">
            {["Description", "Amenities", "Location"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 text-sm font-mono tracking-widest uppercase whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-accent-violet text-chrome' : 'border-transparent text-chrome/50 hover:text-chrome/80'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === "description" && (
              <div className="prose prose-slate max-w-none text-chrome/80 whitespace-pre-wrap">
                {property.description || "Welcome to this beautifully designed property. Detailed description coming soon."}
              </div>
            )}

            {activeTab === "amenities" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {amenitiesList.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 text-chrome border border-black/5 p-3 rounded-lg bg-black/5">
                    <CheckCircle className="w-5 h-5 text-accent-teal shrink-0" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "location" && (
              <div className="w-full h-80 bg-black/5 rounded-2xl border border-black/10 flex items-center justify-center overflow-hidden p-6 text-center">
                <div className="text-chrome/50 flex flex-col items-center gap-4">
                  <MapPin className="w-10 h-10 text-accent-violet/50" />
                  <h3 className="text-lg font-medium text-chrome">{property.location?.address || "Address not specified"}</h3>
                  <p className="text-sm">Location mapping service integration pending.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: Agent Card */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="sticky top-28 glass-card rounded-3xl p-8 text-center group shadow-sm">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
              <img src="/harish-profile.jpg" alt="Harish P" className="relative z-10 w-full h-full object-cover rounded-full border-2 border-accent-violet/30" />
            </div>
            <h4 className="text-2xl font-serif text-chrome mb-1">Harish P</h4>
            <p className="text-accent-teal font-mono text-xs uppercase tracking-widest mb-6">Principal Advisor</p>

            <div className="flex justify-center gap-4">
              <a href={`tel:${settings?.contactPhone?.replace(/\D/g, '') ? '+' + settings.contactPhone.replace(/\D/g, '') : '+918660710354'}`} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-chrome/70 hover:bg-accent-violet hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>
              </a>
              <a href={`${settings?.whatsapp || 'https://wa.me/918660710354'}?text=${whatsappMessage}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-chrome/70 hover:bg-[#25D366] hover:text-white transition-colors">
                <FaWhatsapp className="w-4 h-4" />
              </a>
              <a href={`mailto:${settings?.contactEmail || 'htrproperties2018@gmail.com'}`} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-chrome/70 hover:bg-accent-teal hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}