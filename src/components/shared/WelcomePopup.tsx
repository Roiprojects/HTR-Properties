import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useRHForm } from "react-hook-form";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";
import { X, Sparkles, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const inquirySchema = z.object({
  fullName: z.string().min(2, { message: "Required" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().regex(/^\d{10}$/, { message: "10 digits required" }),
  interestedIn: z.string().min(1, { message: "Required" }),
  propertyLevel: z.string().min(1, { message: "Required" }),
  message: z.string().min(10, { message: "Required (min 10 chars)" })
});

type InquiryFormValues = z.infer<typeof inquirySchema>;

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Only show once per session
    const hasSeenPopup = sessionStorage.getItem("htr_has_seen_popup");
    if (!hasSeenPopup) {
      // Small delay before showing popup
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem("htr_has_seen_popup", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useRHForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      interestedIn: "",
      propertyLevel: "",
      message: ""
    }
  });

  const onSubmit = async (data: InquiryFormValues) => {
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

      toast.success("Inquiry sent successfully. An advisor will contact you soon.", {
        style: { background: '#ffffff', color: '#18181b', border: '1px solid #7C3AED' },
        iconTheme: { primary: '#7C3AED', secondary: '#ffffff' }
      });
      reset();
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit inquiry.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
            className="w-full max-w-[460px] max-h-[90vh] overflow-y-auto hide-scrollbar relative z-10 glass-card bg-primary/95 p-6 md:p-8 rounded-[24px] border border-black/5 shadow-[0_20px_60px_rgba(124,58,237,0.15)]"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent-violet/10 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-teal/10 blur-[60px] rounded-full pointer-events-none" />

            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-chrome/50 hover:text-chrome transition-all z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-6 relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-violet/10 to-accent-teal/10 border border-black/5 flex items-center justify-center text-accent-violet shadow-sm">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-chrome leading-tight">Priority Inquiry</h2>
                  <p className="text-chrome/50 text-xs font-medium tracking-wide uppercase mt-0.5">HTR Exclusive Access</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 relative z-10">

              <div className="grid grid-cols-2 gap-3.5">
                <div className="relative">
                  <input {...register("fullName")} placeholder="Full Name" className="w-full bg-black/5 border border-black/10 rounded-xl py-3 px-4 text-sm text-chrome placeholder-chrome/40 focus:outline-none focus:border-accent-violet focus:bg-white transition-all shadow-sm" />
                  {errors.fullName && <p className="text-red-500 text-[10px] absolute -bottom-4 left-1">{errors.fullName.message}</p>}
                </div>

                <div className="relative">
                  <input {...register("phone")} placeholder="Phone Number" className="w-full bg-black/5 border border-black/10 rounded-xl py-3 px-4 text-sm text-chrome placeholder-chrome/40 focus:outline-none focus:border-accent-violet focus:bg-white transition-all shadow-sm" />
                  {errors.phone && <p className="text-red-500 text-[10px] absolute -bottom-4 left-1">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="relative pt-1">
                <input {...register("email")} placeholder="Email Address" className="w-full bg-black/5 border border-black/10 rounded-xl py-3 px-4 text-sm text-chrome placeholder-chrome/40 focus:outline-none focus:border-accent-violet focus:bg-white transition-all shadow-sm" />
                {errors.email && <p className="text-red-500 text-[10px] absolute -bottom-3 left-1">{errors.email.message}</p>}
              </div>

              <div className="relative pt-1">
                <select {...register("interestedIn")} className="w-full bg-black/5 border border-black/10 rounded-xl py-3 px-4 text-sm text-chrome/70 hover:text-chrome focus:text-chrome [&>option]:bg-secondary focus:outline-none focus:border-accent-violet transition-all shadow-sm appearance-none">
                  <option value="" disabled>Subject of Interest</option>
                  <option value="Buy Property">Buy Property</option>
                  <option value="Rent Property">Rent Property</option>
                  <option value="Sell Property">Sell Property</option>
                  <option value="Investment Advice">Investment Advice</option>
                  <option value="Other">Other</option>
                </select>
                {errors.interestedIn && <p className="text-red-500 text-[10px] absolute -bottom-3 left-1">{errors.interestedIn.message}</p>}
              </div>

              <div className="pt-2">
                <p className="text-chrome/60 text-[11px] uppercase tracking-wider mb-2 font-medium px-1">Property Level</p>
                <div className="grid grid-cols-4 gap-2">
                  {["Level A", "Level B", "Level C", "Any"].map(level => (
                    <label key={level} className="relative flex cursor-pointer group">
                      <input type="radio" value={level} {...register("propertyLevel")} className="peer sr-only" />
                      <div className="w-full py-2 text-center border border-black/10 rounded-lg text-chrome/60 font-mono text-[10px] tracking-wider uppercase peer-checked:border-accent-violet peer-checked:text-accent-violet peer-checked:bg-accent-violet/10 hover:border-black/30 transition-all bg-black/5">
                        {level.replace('Level ', 'LVL ')}
                      </div>
                    </label>
                  ))}
                </div>
                {errors.propertyLevel && <p className="text-red-500 text-[10px] mt-1">{errors.propertyLevel.message}</p>}
              </div>

              <div className="relative pt-1">
                <textarea {...register("message")} rows={2} placeholder="Brief Message..." className="w-full bg-black/5 border border-black/10 rounded-xl py-3 px-4 text-sm text-chrome placeholder-chrome/40 focus:outline-none focus:border-accent-violet focus:bg-white transition-all resize-none shadow-sm"></textarea>
                {errors.message && <p className="text-red-500 text-[10px] absolute -bottom-3 left-1">{errors.message.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium text-sm hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 flex justify-center items-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (
                    <>Submit Priority Inquiry <Sparkles className="w-3.5 h-3.5" /></>
                  )}
                </span>
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
