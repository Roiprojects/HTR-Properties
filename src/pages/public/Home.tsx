import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, MapPin, ArrowRight, ShieldCheck, Headphones, TrendingUp } from "lucide-react";

export default function Home() {

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* 1. Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image/Video with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000" 
            alt="Luxury Property" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent"></div>
          {/* Animated Gradient Mesh (simplified with CSS pulse) */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.1),transparent_50%)] animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-chrome tracking-tight mb-6"
          >
            Rise Above Ordinary Living
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-chrome/90 mb-10 max-w-3xl mx-auto"
          >
            Antigravity brings you properties that elevate your lifestyle. Premium real estate, redefined with futuristic elegance and weightless luxury.
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
            <Link to="/contact" className="w-full sm:w-auto px-8 py-4 rounded-full border border-accent-violet/50 bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-all hover:-translate-y-1">
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
              className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-chrome focus:outline-none focus:border-accent-violet/50 transition-colors"
            />
          </div>
          
          <select className="bg-primary/50 border border-accent-violet/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent-violet/50 min-w-[140px]">
            <option>Buy</option>
            <option>Rent</option>
          </select>
          
          <select className="bg-primary/50 border border-accent-violet/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent-violet/50 min-w-[140px]">
            <option>All Levels</option>
            <option>Level A</option>
            <option>Level B</option>
            <option>Level C</option>
          </select>

          <select className="bg-primary/50 border border-accent-violet/20 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-accent-violet/50 min-w-[120px]">
            <option>Any BHK</option>
            <option>1 BHK</option>
            <option>2 BHK</option>
            <option>3 BHK</option>
          </select>

          <button className="w-full lg:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all">
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
          <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-4">
            <h2 className="font-serif text-4xl md:text-5xl text-chrome tracking-wide relative">
              Featured Listings
              <span className="absolute -bottom-4 left-0 w-24 h-[1px] bg-accent-violet"></span>
            </h2>
            <Link to="/properties" className="text-accent-teal hover:text-chrome transition-colors flex items-center gap-2 font-mono uppercase tracking-widest text-sm hidden sm:flex">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Mock Property Cards */}
            {[
              {
                title: "Skyline Penthouse",
                location: "MG Road, Bangalore",
                price: "₹4.2 Cr",
                specs: ["3 BHK", "2,400 sq.ft.", "Residential"],
                image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=800",
                level: "Level A"
              },
              {
                title: "Zenith Villa",
                location: "Banjara Hills, Hyderabad",
                price: "₹8.5 Cr",
                specs: ["5 BHK", "6,000 sq.ft.", "Villa"],
                image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
                level: "Level A"
              },
              {
                title: "Aura Residences",
                location: "Worli, Mumbai",
                price: "₹12.0 Cr",
                specs: ["4 BHK", "4,500 sq.ft.", "Sea View"],
                image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=800",
                level: "Level B"
              }
            ].map((property, i) => (
              <div key={i} className="flex flex-col h-full glass-card rounded-2xl overflow-hidden group hover:-translate-y-2 transition-transform duration-500 hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]">
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
                    <span className="px-3 py-1 bg-primary/80 border border-accent-teal text-accent-teal font-mono text-xs uppercase tracking-widest rounded backdrop-blur-md shadow-[0_0_10px_rgba(45,212,191,0.3)]">
                      {property.level}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-grow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-medium text-white mb-2">{property.title}</h3>
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
                    <Link to="/properties/sample" className="flex-1 text-center py-2.5 rounded-lg border border-accent-violet/50 hover:bg-accent-violet/10 text-white transition-colors">
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
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">HTR properties Advantage</h2>
            <p className="text-chrome/70 max-w-2xl mx-auto">Experiencing real estate without the usual friction. We streamline the extraordinary.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "Expert Market Knowledge", text: "Insights that place you ahead of the curve." },
              { icon: ShieldCheck, title: "100% Legal Verification", text: "Bulletproof safety for your peace of mind." },
              { icon: Headphones, title: "End-to-End Support", text: "White-glove service from viewing to deed." },
              { icon: TrendingUp, title: "Smart Investments", text: "Properties vetted for maximum appreciation." },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl hover:bg-accent-violet/5 transition-colors group">
                <div className="w-14 h-14 rounded-full bg-accent-violet/20 flex items-center justify-center mb-6 border border-accent-violet/30 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-accent-lavender" />
                </div>
                <h3 className="text-xl text-white mb-3 font-medium">{feature.title}</h3>
                <p className="text-chrome/60 leading-relaxed text-sm">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-violet via-[#4F46E5] to-accent-teal opacity-20"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 glass-card p-12 md:p-20 rounded-3xl border border-accent-lavender/30 shadow-[0_0_50px_rgba(124,58,237,0.3)]">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 drop-shadow-lg">Your Dream Property is One Call Away</h2>
          <p className="text-chrome/90 text-lg mb-10 max-w-2xl mx-auto">Connect with our executive advisors to begin your weightless journey into luxury real estate.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties" className="px-8 py-4 rounded-full bg-white/10 text-white font-bold hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:-translate-y-1 border border-white/20">
              Browse Properties
            </Link>
            <a href="https://wa.me/919876543210" className="px-8 py-4 rounded-full border border-white/50 bg-white/10 backdrop-blur-md text-white font-medium hover:bg-white/20 transition-all hover:-translate-y-1">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}