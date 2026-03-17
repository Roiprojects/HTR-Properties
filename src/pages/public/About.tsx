import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Target, Lightbulb, Shield, Users, Award, Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000" 
            alt="Futuristic Architecture" 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/80 to-primary"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-white tracking-wide mb-6"
          >
            We Don't Just Sell Properties. <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">We Elevate Lives.</span>
          </motion.h1>
        </div>
      </section>

      {/* 2. Our Story */}
      <section className="py-24 px-4 bg-primary relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl text-white mb-6 flex flex-col gap-2">
              <span className="text-accent-teal font-mono text-sm uppercase tracking-widest">The Genesis</span>
              Our Story
            </h2>
            <div className="prose prose-invert prose-lg text-chrome/80">
              <p>
                Founded in 2010, Antigravity was born from a singular vision: to break the heavy, outdated paradigms of the real estate industry. We noticed that luxury wasn't just about price tags; it was about the experience—a seamless, floating transition into a new chapter of life.
              </p>
              <p>
                From our first high-rise penthouse deal to managing over ₹500 Crores in premium assets across the country, our approach has always been analytical, empathetic, and ruthlessly transparent.
              </p>
              <p>
                We curate properties that defy the ordinary. Welcome to weightless living.
              </p>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-violet to-accent-teal opacity-20 blur-2xl rounded-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000" 
              alt="Office" 
              className="relative z-10 rounded-2xl shadow-[0_0_40px_rgba(124,58,237,0.2)] border border-accent-violet/20 object-cover aspect-[4/5] lg:aspect-square w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="py-24 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-12 rounded-3xl group hover:border-accent-violet/40 transition-colors">
            <Target className="w-12 h-12 text-accent-teal mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-serif text-3xl text-white mb-4">Our Mission</h3>
            <p className="text-chrome/70 leading-relaxed">
              To provide an unparalleled, frictionless real estate journey by combining deep market intelligence with human-centric advisory, ensuring every client finds their ultimate sanctuary.
            </p>
          </div>
          <div className="glass-card p-12 rounded-3xl group hover:border-accent-violet/40 transition-colors">
            <Lightbulb className="w-12 h-12 text-accent-violet mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-serif text-3xl text-white mb-4">Our Vision</h3>
            <p className="text-chrome/70 leading-relaxed">
              To be the most trusted and visionary luxury real estate brand globally, setting the benchmark for architectural curation and bespoke client experiences.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Core Values */}
      <section className="py-24 px-4 bg-primary relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-violet/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-white">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Integrity Above All", desc: "No hidden clauses. Absolute transparency." },
              { icon: Award, title: "Relentless Excellence", desc: "We only settle for the extraordinary." },
              { icon: Users, title: "Client Centric", desc: "Your goals dictate our strategies." },
              { icon: Target, title: "Foresight", desc: "Anticipating market shifts before they happen." },
            ].map((value, i) => (
              <div key={i} className="bg-secondary/50 border border-white/5 p-8 rounded-2xl hover:bg-white/5 transition-colors text-center">
                <value.icon className="w-10 h-10 text-chrome mx-auto mb-6" />
                <h4 className="text-xl font-medium text-white mb-3">{value.title}</h4>
                <p className="text-sm text-chrome/60">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Team Section */}
      <section className="py-24 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-white mb-4">The Architects of Your Dream</h2>
            <p className="text-chrome/70 max-w-2xl mx-auto">Meet the elite advisors behind our success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { name: "Aria Sterling", role: "Principal Advisor", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400" },
              { name: "Marcus Vance", role: "Head of Commercial", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" },
              { name: "Elena Rostova", role: "Luxury Properties Lead", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400" },
            ].map((agent, i) => (
              <div key={i} className="glass-card rounded-3xl p-8 text-center group">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                  <img src={agent.img} alt={agent.name} className="relative z-10 w-full h-full object-cover rounded-full border-2 border-accent-violet/30" />
                </div>
                <h4 className="text-2xl font-serif text-white mb-1">{agent.name}</h4>
                <p className="text-accent-teal font-mono text-xs uppercase tracking-widest mb-6">{agent.role}</p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-chrome/70 hover:bg-accent-violet hover:text-white transition-colors"><Phone className="w-4 h-4" /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-chrome/70 hover:bg-[#25D366] hover:text-white transition-colors"><FaWhatsapp className="w-4 h-4" /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-chrome/70 hover:bg-white hover:text-primary transition-colors"><Mail className="w-4 h-4" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Banner */}
      <section className="py-24 px-4 bg-primary text-center">
        <h2 className="font-serif text-4xl text-white mb-8">Ready to elevate your portfolio?</h2>
        <Link to="/contact" className="inline-block px-10 py-4 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all hover:-translate-y-1">
          Speak to an Advisor
        </Link>
      </section>
    </div>
  );
}