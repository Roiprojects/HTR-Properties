import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useRHForm } from "react-hook-form";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaFacebook, FaLinkedin, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { useSettings } from "../../contexts/SettingsContext";

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
  const { settings } = useSettings();
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

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leads').insert([{
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        interested_in: data.interestedIn,
        property_level: data.propertyLevel,
        message: data.message,
        status: 'New'
      }]);

      if (error) throw error;

      toast.success("Inquiry sent successfully. An advisor will contact you within 4 business hours.", {
        style: { background: '#ffffff', color: '#18181b', border: '1px solid #7C3AED' },
        iconTheme: { primary: '#0D9488', secondary: '#ffffff' }
      });
      reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit inquiry.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary pb-24">
      <section className="relative pt-12 pb-16 px-4 border-b border-accent-violet/10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-teal/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="font-serif text-4xl md:text-6xl text-chrome mb-4">Connect With Us</h1>
          <p className="text-chrome/70 text-lg max-w-2xl mx-auto">
            Ready to secure your legacy? Our executive advisors are standing by to guide your next move.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">

          {/* LEFT: Contact Form */}
          <div className="glass-card p-8 md:p-12 rounded-3xl border border-black/10 shadow-sm relative">
            <h2 className="font-serif text-3xl text-chrome mb-8">Send an Inquiry</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-chrome/70 text-sm mb-2">Full Name *</label>
                  <input {...register("fullName")} placeholder="Jane Doe" className="w-full bg-black/5 border border-black/10 rounded-lg py-3 px-4 text-chrome placeholder-chrome/30 focus:outline-none focus:border-accent-violet transition-colors" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-chrome/70 text-sm mb-2">Email Address *</label>
                  <input {...register("email")} placeholder="jane@example.com" className="w-full bg-black/5 border border-black/10 rounded-lg py-3 px-4 text-chrome placeholder-chrome/30 focus:outline-none focus:border-accent-violet transition-colors" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-chrome/70 text-sm mb-2">Phone Number *</label>
                  <input {...register("phone")} placeholder="9886661254" className="w-full bg-black/5 border border-black/10 rounded-lg py-3 px-4 text-chrome placeholder-chrome/30 focus:outline-none focus:border-accent-violet transition-colors" />
                  {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-chrome/70 text-sm mb-2">Interested In *</label>
                  <select {...register("interestedIn")} className="w-full bg-black/5 border border-black/10 rounded-lg py-3 px-4 text-chrome [&>option]:bg-secondary focus:outline-none focus:border-accent-violet transition-colors">
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
                      <div className="w-full py-3 text-center border border-black/10 rounded-lg text-chrome/50 font-mono text-xs tracking-widest uppercase peer-checked:border-accent-violet peer-checked:text-accent-violet peer-checked:bg-accent-violet/10 group-hover:border-accent-violet/50 transition-colors">
                        {level}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.propertyLevel && <p className="text-red-400 text-xs mt-1">{errors.propertyLevel.message}</p>}
              </div>

              <div>
                <label className="block text-chrome/70 text-sm mb-2">Message *</label>
                <textarea {...register("message")} rows={4} placeholder="How can we help you?" className="w-full bg-black/5 border border-black/10 rounded-lg py-3 px-4 text-chrome placeholder-chrome/30 focus:outline-none focus:border-accent-violet transition-colors"></textarea>
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
            <div className="glass-card p-8 md:p-12 rounded-3xl border border-black/10 flex-1 shadow-sm">
              <h3 className="font-serif text-3xl text-chrome mb-8">Headquarters</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-violet/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent-violet" />
                  </div>
                  <div>
                    <h4 className="text-chrome font-medium mb-1">Office Address</h4>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings?.address || '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-chrome/60 hover:text-accent-violet transition-colors leading-relaxed text-sm block whitespace-pre-line"
                    >
                      {settings?.address || "Address"}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#25D366]" />
                  </div>
                  <div>
                    <h4 className="text-chrome font-medium mb-1">Direct Line</h4>
                    <a href={`tel:${settings?.contactPhone.replace(/\\D/g, '')}`} className="text-chrome/60 hover:text-accent-violet transition-colors text-sm block mb-1">{settings?.contactPhone || "Phone"}</a>
                    <div className="flex flex-col gap-1.5 mt-2">
                      <a href={settings?.whatsapp} className="text-[#25D366] hover:text-[#25D366]/80 transition-colors text-sm flex items-center gap-1 font-medium"><FaWhatsapp /> WhatsApp US</a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent-teal/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-accent-teal" />
                  </div>
                  <div>
                    <h4 className="text-chrome font-medium mb-1">Email</h4>
                    <a href={`mailto:${settings?.contactEmail}`} className="text-chrome/60 hover:text-accent-violet transition-colors text-sm">{settings?.contactEmail || "Email"}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-chrome" />
                  </div>
                  <div>
                    <h4 className="text-chrome font-medium mb-1">Business Hours</h4>
                    <p className="text-chrome/60 text-sm">Mon - Sat : 9:30 AM - 7:00 PM<br />Sun: 9:30 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-10 border-t border-black/10 flex gap-4">
                {settings?.instagram && <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-chrome/50 hover:bg-accent-violet hover:text-white hover:border-transparent transition-all"><FaInstagram className="w-4 h-4" /></a>}
                {settings?.facebook && <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-chrome/50 hover:bg-blue-600 hover:text-white hover:border-transparent transition-all"><FaFacebook className="w-4 h-4" /></a>}
                {settings?.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-chrome/50 hover:bg-blue-700 hover:text-white hover:border-transparent transition-all"><FaLinkedin className="w-4 h-4" /></a>}
                {settings?.youtube && <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-chrome/50 hover:bg-red-600 hover:text-white hover:border-transparent transition-all"><FaYoutube className="w-4 h-4" /></a>}
                {settings?.twitter && <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-chrome/50 hover:bg-white hover:text-black hover:border-transparent transition-all"><FaXTwitter className="w-4 h-4" /></a>}
              </div>
            </div>

            {/* Map Embed */}
            <div className="h-64 rounded-3xl overflow-hidden glass-card border border-black/10 relative group shadow-sm bg-secondary">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.52554!2d77.5515255!3d12.978254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3d8db8655e0f%3A0xc62efac1d5e6878b!2s1294%2C%207th%20Main%20Rd%2C%20A%20Block%2C%20Milk%20Colony%2C%20Subramanyanagar%2C%202nd%20Stage%2C%20Rajajinagar%2C%20Bengaluru%2C%20Karnataka%20560010!5e0!3m2!1sen!2sin!4v1742385123456!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="HTR Properties Headquarters"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}