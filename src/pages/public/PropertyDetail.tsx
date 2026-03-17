import { useState } from "react";

import { MapPin, Box, Home, ArrowLeft, CheckCircle, Bed, Bath, Car, Maximize } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function PropertyDetail() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="min-h-screen bg-primary pb-20">
      {/* 1. Gallery Section */}
      <section className="h-[60vh] md:h-[75vh] w-full relative grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-2 p-2 pt-20">
        <div className="md:col-span-2 row-span-2 relative group overflow-hidden rounded-xl">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Main" />
          <button className="absolute top-4 left-4 w-10 h-10 bg-primary/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-accent-violet transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="hidden md:block overflow-hidden rounded-xl relative group">
          <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Room 1" />
        </div>
        <div className="hidden md:block overflow-hidden rounded-xl relative group">
          <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Room 2" />
        </div>
        <div className="hidden md:block overflow-hidden rounded-xl relative group">
          <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Room 3" />
        </div>
        <div className="hidden md:block overflow-hidden rounded-xl relative group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Room 4" />
          <div className="absolute inset-0 bg-primary/50 flex items-center justify-center">
            <span className="flex items-center gap-2 text-white font-medium border border-white/30 px-4 py-2 rounded-full glass-card"><Maximize className="w-4 h-4"/> View All Photos</span>
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
              <span className="px-3 py-1 bg-accent-violet/10 text-accent-violet font-mono border border-accent-violet/30 rounded-md text-xs tracking-widest uppercase">For Sale</span>
              <span className="px-3 py-1 bg-accent-teal/10 text-accent-teal font-mono border border-accent-teal/30 rounded-md text-xs tracking-widest uppercase">Level A</span>
              <span className="px-3 py-1 bg-white/5 text-chrome font-mono border border-white/10 rounded-md text-xs tracking-widest uppercase">Verified</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">Skyline Penthouse</h1>
            <p className="text-chrome/60 flex items-center gap-2 text-lg"><MapPin className="w-5 h-5 text-accent-violet" /> 45 Mg Road, Bangalore Central</p>
          </div>

          <div className="text-3xl md:text-5xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal mb-10 pb-10 border-b border-white/10">
            ₹4,20,00,000
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: Bed, val: "3 Bedrooms" },
              { icon: Bath, val: "4 Bathrooms" },
              { icon: Box, val: "2,400 sq.ft." },
              { icon: Car, val: "2 Parking" },
            ].map((stat, i) => (
              <div key={i} className="bg-secondary/50 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 items-center text-center">
                <stat.icon className="w-6 h-6 text-accent-lavender" />
                <span className="text-white font-medium text-sm">{stat.val}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
            {["Description", "Amenities", "Location"].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 text-sm font-mono tracking-widest uppercase whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.toLowerCase() ? 'border-accent-violet text-white' : 'border-transparent text-chrome/50 hover:text-chrome/80'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[300px]">
            {activeTab === "description" && (
              <div className="prose prose-invert max-w-none text-chrome/80">
                <p>Welcome to the Skyline Penthouse — a masterpiece of modern architecture floating above the vibrant heart of the city. With sweeping floor-to-ceiling windows, this immaculate residence offers 270-degree panoramic views that transform with the shifting light of day.</p>
                <p>Every inch of this 2,400 square-foot sanctuary has been curated for those who demand the absolute best. Features include Italian marble flooring, a state-of-the-art European modular kitchen, smart home automation by Control4, and a private terrace garden complete with a temperature-controlled plunge pool.</p>
                <ul>
                  <li>Fully automated smart home systems</li>
                  <li>In-built VRF air conditioning</li>
                  <li>Custom Italian wardrobe systems</li>
                </ul>
              </div>
            )}
            
            {activeTab === "amenities" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {["Infinity Pool", "24/7 Concierge", "Private Elevator", "Smart Home", "Fitness Center", "Spa & Sauna", "Theater Room", "Wine Cellar"].map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 text-chrome border border-white/5 p-3 rounded-lg bg-white/5">
                    <CheckCircle className="w-5 h-5 text-accent-teal" />
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "location" && (
              <div className="w-full h-80 bg-secondary rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="text-chrome/50 flex flex-col items-center gap-2">
                  <MapPin className="w-8 h-8"/>
                  <p>Map Integration Goes Here</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COMPONENT: Agent Card */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="sticky top-28 glass-card border border-accent-violet/30 rounded-3xl p-8 text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <h3 className="font-serif text-2xl text-white mb-6">Interested in this property?</h3>
            
            <div className="relative w-24 h-24 mx-auto mb-4">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200" alt="Agent" className="rounded-full w-full h-full object-cover border-2 border-accent-violet/50" />
            </div>
            <h4 className="text-xl font-medium text-white mb-1">Aria Sterling</h4>
            <p className="text-accent-teal font-mono text-xs uppercase tracking-widest mb-6">Principal Advisor</p>
            
            <div className="flex flex-col gap-3">
              <button className="w-full py-4 rounded-xl border border-accent-violet text-accent-violet hover:bg-accent-violet hover:text-white transition-all font-medium flex justify-center items-center gap-2">
                <Home className="w-5 h-5" /> Schedule a Tour
              </button>
              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex justify-center items-center gap-2">
                <FaWhatsapp className="w-5 h-5" /> Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}