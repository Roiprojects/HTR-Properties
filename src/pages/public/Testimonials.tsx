import { useState, useEffect } from "react";
import { Star, PlayCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar: string;
  type: "Text" | "Video";
  reference: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*').eq('status', 'Active').order('created_at', { ascending: false });
    if (data) {
      setTestimonials(data.map(d => ({
        id: d.id,
        clientName: d.client_name,
        role: d.role,
        company: d.company,
        content: d.content,
        rating: d.rating,
        avatar: d.avatar,
        type: d.type,
        reference: d.reference
      })));
    }
  };

  const textTestimonials = testimonials.filter(t => t.type === 'Text' && (filter === 'All' || `${t.rating} Star` === filter));
  const videoTestimonials = testimonials.filter(t => t.type === 'Video');

  return (
    <div className="min-h-screen bg-primary">
      <section className="relative pt-32 pb-16 px-4 border-b border-accent-violet/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-serif text-4xl md:text-6xl text-chrome mb-4">What Our Clients Say</h1>
          <p className="text-chrome/70 text-lg">Real stories from people who chose to rise above the ordinary.</p>
          <a href="https://www.google.com/search?q=htr+properties&rlz=1C1YQLS_enIN1202IN1202&oq=htr+prop&gs_lcrp=EgZjaHJvbWUqCggAEAAY4wIYgAQyCggAEAAY4wIYgAQyDQgBEC4YrwEYxwEYgAQyBggCEEUYOTIICAMQABgWGB4yCAgEEAAYFhgeMggIBRAAGBYYHjIKCAYQABgKGBYYHjIICAcQABgWGB4yCAgIEAAYFhgeMggICRAAGBYYHtIBCTYzMzFqMGoxNagCCLACAfEFHSmXykcf6ATxBR0pl8pHH-gE&sourceid=chrome&ie=UTF-8#lrd=0x3bae3dacfdc050a7:0xc0f340151bcc4988,1,,,," target="_blank" rel="noopener noreferrer" className="text-accent-teal hover:underline">Read more on Google Reviews</a>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        {/* Rating Filter */}
        <div className="flex justify-center gap-4 mb-16">
          {["All", "5 Star", "4 Star"].map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-6 py-2 rounded-full border border-black/10 transition-colors text-sm font-mono tracking-widest uppercase ${filter === t ? 'bg-accent-violet text-white border-transparent' : 'text-chrome/70 hover:bg-black/5 hover:text-chrome'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {textTestimonials.map(item => (
            <div key={item.id} className="glass-card p-8 rounded-3xl relative group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 right-8 -translate-y-1/2 text-[120px] font-serif leading-none text-accent-violet/10 select-none">"</div>

              <div className="flex gap-1 mb-6 text-accent-violet">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < item.rating ? 'fill-current' : 'opacity-20'}`} />
                ))}
              </div>

              <p className="font-serif text-chrome/80 text-xl italic mb-8 relative z-10">
                "{item.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-black/10 pt-6">
                <img src={item.avatar} className="w-12 h-12 rounded-full border-2 border-accent-teal/50" alt={item.clientName} />
                <div>
                  <h4 className="text-chrome font-medium">{item.clientName}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-20 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl text-chrome text-center mb-12">Video Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoTestimonials.map(item => (
              <div key={item.id} className="relative rounded-3xl overflow-hidden aspect-video group cursor-pointer border border-black/10">
                <img src={item.avatar} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Video thumbnail" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-accent-teal/80 group-hover:text-white transition-colors group-hover:scale-110 duration-300" />
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                  <h4 className="font-medium text-lg drop-shadow-md">{item.clientName}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center">
        <h2 className="font-serif text-3xl text-chrome mb-6">Ready to write your own success story?</h2>
        <Link to="/contact" className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all">
          Start Your Journey
        </Link>
      </section>
    </div>
  );
}