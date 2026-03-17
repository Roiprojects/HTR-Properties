import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useRHForm } from "react-hook-form";
import toast from "react-hot-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaXTwitter } from "react-icons/fa6";

const contactSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().regex(/^\d{10}$/, { message: "Phone number must be exactly 10 digits." }),
  interestedIn: z.string().min(1, { message: "Please select your primary interest." }),
  propertyLevel: z.string().min(1, { message: "Please select a property level preference." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useRHForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      interestedIn: "",
      propertyLevel: ""
    }
  });

  const onSubmit = async (_data: ContactFormValues) => {
    setIsSubmitting(true);
    // Simulate Supabase INSERT
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success("Inquiry sent successfully. An advisor will contact you within 4 business hours.", {
      style: { background: '#0F0F1A', color: '#fff', border: '1px solid #7C3AED' },
      iconTheme: { primary: '#2DD4BF', secondary: '#0F0F1A' }
    });
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-primary pb-24">
      <section className="relative pt-32 pb-16 px-4 border-b border-accent-violet/10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-6xl text-white mb-4">Connect With Us</h1>
          <p className="text-chrome/70 text-lg max-w-2xl mx-auto">
            Ready to secure your legacy? Our executive advisors are standing by to guide your next move.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">
          
          {/* LEFT: Contact Form */}
          <div className="glass-card p-8 md:p-12 rounded-3xl border border-accent-violet/20 shadow-[0_15px_40px_rgba(124,58,237,0.1)] relative">
            <h2 className="font-serif text-3xl text-white mb-8">Send an Inquiry</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-chrome/70 text-sm mb-2">Full Name *</label>
                  <input {...register("fullName")} placeholder="Jane Doe" className="w-full bg-primary/50 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-chrome/30 focus:outline-none focus:border-accent-violet transition-colors" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-chrome/70 text-sm mb-2">Email Address *</label>
                  <input {...register("email")} placeholder="jane@example.com" className="w-full bg-primary/50 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-chrome/30 focus:outline-none focus:border-accent-violet transition-colors" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-chrome/70 text-sm mb-2">Phone Number *</label>
                  <input {...register("phone")} placeholder="9876543210" className="w-full bg-primary/50 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-chrome/30 focus:outline-none focus:border-accent-violet transition-colors" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-chrome/70 text-sm mb-2">Interested In *</label>
                  <select {...register("interestedIn")} className="w-full bg-primary/50 border border-white/10 rounded-lg py-3 px-4 text-white [&>option]:bg-secondary focus:outline-none focus:border-accent-violet transition-colors">
                    <option value="" disabled>Select Reason</option>
                    <option value="Buy Property">Buy Property</option>
                    <option value="Rent Property">Rent Property</option>
                    <option value="Sell Property">Sell Property</option>
                    <option value="Investment Advice">Investment Advice</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.interestedIn && <p className="text-red-400 text-xs mt-1">{errors.interestedIn.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-chrome/70 text-sm mb-2">Property Level Preference *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {["Level A", "Level B", "Level C", "Any"].map(level => (
                    <label key={level} className="relative flex cursor-pointer group">
                      <input type="radio" value={level} {...register("propertyLevel")} className="peer sr-only" />
                      <div className="w-full py-3 text-center border border-white/10 rounded-lg text-chrome/50 font-mono text-xs tracking-widest uppercase peer-checked:border-accent-violet peer-checked:text-accent-violet peer-checked:bg-accent-violet/10 group-hover:border-accent-violet/50 transition-colors">
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.propertyLevel && <p className="text-red-400 text-xs mt-1">{errors.propertyLevel.message}</p>}
              </div>

              <div>
                <label className="block text-chrome/70 text-sm mb-2">Message *</label>
                <textarea {...register("message")} rows={4} placeholder="How can we help you?" className="w-full bg-primary/50 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-chrome/30 focus:outline-none focus:border-accent-violet transition-colors"></textarea>
                {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Submit Inquiry"}
              </button>
              
              <p className="text-center text-accent-teal font-mono text-xs uppercase tracking-widest mt-4">We typically respond within 4 business hours</p>
            </form>
          </div>

          {/* RIGHT: Contact Info & Map */}
          <div className="flex flex-col gap-8">
            <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 flex-1">
              <h3 className="font-serif text-3xl text-white mb-8">Headquarters</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-violet/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent-violet" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Office Address</h4>
                    <p className="text-chrome/60 leading-relaxed text-sm">Level 45, Zenith Tower<br/>Connaught Place, New Delhi<br/>110001, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Direct Line</h4>
                    <a href="tel:+919876543210" className="text-chrome/60 hover:text-white transition-colors text-sm block mb-1">+91 98765 43210</a>
                    <a href="https://wa.me/919876543210" className="text-[#25D366] hover:text-[#25D366]/80 transition-colors text-sm flex items-center gap-1 font-medium"><FaWhatsapp /> WhatsApp Us</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-teal/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-accent-teal" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <a href="mailto:hello@antigravity.in" className="text-chrome/60 hover:text-white transition-colors text-sm">hello@antigravity.in</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-chrome" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Business Hours</h4>
                    <p className="text-chrome/60 text-sm">Mon - Fri: 10:00 AM - 7:00 PM<br/>Sat: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-white/10 flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-chrome/50 hover:bg-accent-violet hover:text-white hover:border-transparent transition-all"><FaInstagram className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-chrome/50 hover:bg-accent-violet hover:text-white hover:border-transparent transition-all"><FaFacebook className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-chrome/50 hover:bg-accent-violet hover:text-white hover:border-transparent transition-all"><FaLinkedin className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-chrome/50 hover:bg-accent-violet hover:text-white hover:border-transparent transition-all"><FaYoutube className="w-4 h-4" /></a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-chrome/50 hover:bg-accent-violet hover:text-white hover:border-transparent transition-all"><FaXTwitter className="w-4 h-4" /></a>
              </div>
            </div>

            {/* Map Embed Dummy */}
            <div className="h-64 rounded-3xl overflow-hidden glass-card border border-white/10 relative group">
              <div className="absolute inset-0 bg-secondary/80 flex items-center justify-center group-hover:bg-secondary/60 transition-colors">
                <p className="text-white/50 font-mono text-sm tracking-widest uppercase flex items-center gap-2"><MapPin className="w-4 h-4"/> Interactive Map Embed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}