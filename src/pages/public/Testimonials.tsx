import { Star, PlayCircle } from "lucide-react";

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-primary">
      <section className="relative pt-32 pb-16 px-4 border-b border-accent-violet/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-4">What Our Clients Say</h1>
          <p className="text-chrome/70 text-lg">Real stories from people who chose to rise above the ordinary.</p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        {/* Rating Filter (Visual Only) */}
        <div className="flex justify-center gap-4 mb-16">
          {["All", "5 Star", "4 Star"].map(t => (
            <button key={t} className="px-6 py-2 rounded-full border border-white/10 text-chrome/70 hover:bg-white/5 hover:text-white transition-colors text-sm font-mono tracking-widest uppercase">
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="glass-card p-8 rounded-3xl relative group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 right-8 -translate-y-1/2 text-[120px] font-serif leading-none text-accent-violet/10 select-none">"</div>
              
              <div className="flex gap-1 mb-6 text-accent-violet">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              
              <p className="font-serif text-chrome/80 text-xl italic mb-8 relative z-10">
                "Finding our dream home with Antigravity was seamless. Their attention to detail and market knowledge is truly unmatched in the luxury space."
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/10 pt-6">
                <img src={`https://i.pravatar.cc/150?img=${i+10}`} className="w-12 h-12 rounded-full border-2 border-accent-teal/50" alt="Client" />
                <div>
                  <h4 className="text-white font-medium">Jonathan Doe</h4>
                  <p className="text-chrome/50 text-sm">CEO, TechCorp · Bought Level A</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl text-white text-center mb-12">Video Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="relative rounded-3xl overflow-hidden aspect-video group cursor-pointer border border-white/10">
                <img src={`https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800&sig=${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Video thumbnail" />
                <div className="absolute inset-0 bg-primary/40 flex items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-accent-teal/80 group-hover:text-white transition-colors group-hover:scale-110 duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-20 text-center">
         <h2 className="font-serif text-3xl text-white mb-6">Ready to write your own success story?</h2>
         <button className="px-8 py-4 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all">Start Your Journey</button>
      </section>
    </div>
  );
}