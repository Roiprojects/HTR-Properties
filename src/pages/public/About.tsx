import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

import { Target, Lightbulb, Shield, Users, Award, Phone, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";
import { useSettings } from "../../contexts/SettingsContext";

export default function About() {
  const { settings } = useSettings();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const awards = [
    {
      title: "RERA Certified Agency",
      img: "/htr property awards and recognitation/RERA certificate.jpg"
    },
    {
      title: "Top Performing Partner",
      img: "/htr property awards and recognitation/Certificate by Edge.png"
    },
    {
      title: "Outstanding Contribution",
      img: "/htr property awards and recognitation/Certificate by SPACE.png"
    },
    {
      title: "Top Performing Partner",
      img: "/htr property awards and recognitation/Certificate by Phoenix Edge.png"
    },
    {
      title: "Certificate of Appreciation",
      img: "/htr property awards and recognitation/Certificate 2 by Phoenix Edge.png"
    },
    {
      title: "Star Performer Award",
      img: "/htr property awards and recognitation/Star performer award.png"
    }
  ];



  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    let animationId: number;

    // Optional: Start scroll position in the middle set to allow seamless manual dragging left
    if (container.scrollLeft === 0) {
      container.scrollLeft = container.scrollWidth / 3;
    }

    const render = () => {
      if (!isPaused && container) {
        container.scrollLeft += 1; // Adjust speed
        
        const singleSetWidth = container.scrollWidth / 3;
        
        // Loop back seamlessly when reaching the third duplicate
        if (container.scrollLeft >= singleSetWidth * 2) {
          container.scrollLeft -= singleSetWidth;
        } 
        // Loop forward seamlessly if dragged too far left
        else if (container.scrollLeft <= 0) {
          container.scrollLeft += singleSetWidth;
        }
      }
      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 text-chrome">
          <img
            src="/about-hero.png"
            alt="South Indian Luxury Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-serif text-5xl md:text-7xl text-white tracking-wide mb-6"
          >
            We Don't Just Sell Properties. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-violet to-accent-teal">We Elevate Lives.</span>
          </motion.h1>
        </div>
      </section>

      {/* 2. Our Story */}
      {settings?.aboutStory && settings.aboutStory.trim() !== "" && (
        <section className="py-24 px-4 bg-primary relative">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-4xl text-chrome mb-6 flex flex-col gap-2">
                <span className="text-accent-teal font-mono text-sm uppercase tracking-widest">The Genesis</span>
                Our Story
              </h2>
              <h5>HTR Properties is a premier real estate.</h5>
              <div className="prose prose-slate prose-lg text-chrome/80">
                <p className="whitespace-pre-wrap">
                  {settings.aboutStory}
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
                src="/harish-profile.jpg"
                alt="Harish P - Principal Advisor"
                className="relative z-10 rounded-2xl shadow-[0_0_40px_rgba(124,58,237,0.2)] border border-accent-violet/20 object-cover aspect-[4/5] lg:aspect-square w-full"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* 3. Mission & Vision */}
      <section className="py-24 px-4 bg-secondary">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-12 rounded-3xl group hover:border-accent-violet/40 transition-colors">
            <Target className="w-12 h-12 text-accent-teal mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-serif text-3xl text-chrome mb-4">Our Mission</h3>
            <p className="text-chrome/70 leading-relaxed">
              To provide an unparalleled, frictionless real estate journey by combining deep market intelligence with human-centric advisory, ensuring every client finds their ultimate sanctuary.
            </p>
          </div>
          <div className="glass-card p-12 rounded-3xl group hover:border-accent-violet/40 transition-colors">
            <Lightbulb className="w-12 h-12 text-accent-violet mb-6 group-hover:scale-110 transition-transform" />
            <h3 className="font-serif text-3xl text-chrome mb-4">Our Vision</h3>
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
            <h2 className="font-serif text-4xl text-chrome">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Integrity Above All", desc: "No hidden clauses. Absolute transparency." },
              { icon: Award, title: "Relentless Excellence", desc: "We only settle for the extraordinary." },
              { icon: Users, title: "Client Centric", desc: "Your goals dictate our strategies." },
              { icon: Target, title: "Foresight", desc: "Anticipating market shifts before they happen." },
            ].map((value, i) => (
              <div key={i} className="bg-black/5 border border-black/5 p-8 rounded-2xl hover:bg-black/10 transition-colors text-center">
                <value.icon className="w-10 h-10 text-chrome mx-auto mb-6" />
                <h4 className="text-xl font-medium text-chrome mb-3">{value.title}</h4>
                <p className="text-sm text-chrome/60">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Awards & Recognition */}
      <section className="py-24 px-4 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-accent-violet/5 to-accent-teal/5"></div>
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-4xl text-chrome"
            >
              Awards & Recognition
            </motion.h2>
            <p className="text-chrome/70 mt-4 max-w-2xl mx-auto">Celebrating excellence and our commitment to unparalleled service.</p>
          </div>

          <div
            className="relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Scroll Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-16 md:gap-24 overflow-x-auto hide-scrollbar cursor-grab active:cursor-grabbing items-center px-8"
              style={{ paddingBottom: "2rem" }}
            >
              {[...awards, ...awards, ...awards].map((award, i) => (
                <div
                  key={i}
                  className="min-w-[280px] md:min-w-[340px] flex-shrink-0 flex flex-col items-center group/card px-4"
                >
                  {/* Professional Gallery Frame */}
                  <div className="relative bg-white p-3 md:p-5 border-[8px] md:border-[12px] border-[#18181b] shadow-2xl group-hover/card:-translate-y-3 group-hover/card:shadow-[0_25px_50px_-12px_rgba(124,58,237,0.3)] transition-all duration-500 ease-out transform-gpu">
                    {/* Inner Mat shadow/border effect */}
                    <div className="absolute inset-0 border border-black/10 shadow-[inset_0_0_15px_rgba(0,0,0,0.04)] pointer-events-none z-10"></div>
                    
                    <img
                      src={award.img}
                      alt={award.title}
                      className="relative z-0 w-full h-48 md:h-60 lg:h-72 object-contain"
                    />
                  </div>
                  
                  <div className="mt-8 text-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                    <h4 className="text-lg md:text-xl font-serif text-chrome mb-2">{award.title}</h4>
                    <span className="w-12 h-0.5 bg-accent-violet/50 mx-auto block rounded-full"></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Team Section */}
      <section className="py-24 px-4 bg-primary">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-chrome mb-4">The Architects of Your Dream</h2>
            <p className="text-chrome/70 max-w-2xl mx-auto">Meet the elite advisors behind our success.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-10">
            {[
              { name: "Harish P", role: "Principal Advisor", img: "/harish-profile.jpg" },

            ].map((agent, i) => (
              <div key={i} className="glass-card rounded-3xl p-8 text-center group">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-violet to-accent-teal animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
                  <img src={agent.img} alt={agent.name} className="relative z-10 w-full h-full object-cover rounded-full border-2 border-accent-violet/30" />
                </div>
                <h4 className="text-2xl font-serif text-chrome mb-1">{agent.name}</h4>
                <p className="text-accent-teal font-mono text-xs uppercase tracking-widest mb-6">{agent.role}</p>
                <div className="flex justify-center gap-4">
                  <a href={`tel:${settings?.contactPhone.replace(/\\D/g, '') || '919886661254'}`} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-chrome/70 hover:bg-accent-violet hover:text-white transition-colors"><Phone className="w-4 h-4" /></a>
                  {settings?.whatsapp && <a href={settings.whatsapp} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-chrome/70 hover:bg-[#25D366] hover:text-white transition-colors"><FaWhatsapp className="w-4 h-4" /></a>}
                  <a href={`mailto:${settings?.contactEmail || 'hello@antigravity.in'}`} className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-chrome/70 hover:bg-accent-teal hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RERA Section */}
      <section className="py-24 px-4 bg-secondary font-sans border-t border-black/5">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12 bg-white/50 backdrop-blur-sm p-8 md:p-12 rounded-[2rem] border border-black/5 shadow-sm">
          <div className="w-full md:w-1/3 flex justify-center order-1 md:order-2">
            <div className="relative group">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-[40px] group-hover:bg-red-500/30 transition-all duration-500"></div>
              <img 
                src="/rera_approved.png" 
                alt="RERA Approved Stamp" 
                className="relative z-10 w-48 h-48 md:w-64 md:h-64 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          
          <div className="w-full md:w-2/3 text-center md:text-left order-2 md:order-1">
            <div className="inline-flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-red-100">
              <Shield className="w-4 h-4" />
              <span>Government Approved</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-chrome mb-6">
              RERA Compliant & <span className="text-red-700">Certified</span>
            </h2>
            
            <p className="text-chrome/70 leading-relaxed mb-8 text-[15px] md:text-base text-justify md:text-left">
              The Real Estate Regulation and Development (RERA) Act, 2016 is considered as one of the landmark legislations passed by the Government of India. Its objective is to reform the real estate sector in India, encouraging greater transparency, citizen centricity, accountability and financial discipline. This is in line with the vast and growing economy of India as in future many people will be investing in the real estate sector.
            </p>
            
            <div className="block sm:inline-block bg-white border border-black/10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-red-600"></div>
              <p className="font-mono text-xs text-chrome/50 uppercase tracking-widest mb-1 pl-2">RERA Registration No</p>
              <p className="font-mono text-xs sm:text-sm md:text-base font-bold text-chrome pl-2 tracking-wide group-hover:text-red-700 transition-colors break-all">
                PRM/KA/RERA/1251/309/AG/190125/001242
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}