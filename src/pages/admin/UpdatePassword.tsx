import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { Lock } from "lucide-react";
import logo from "../../assets/logo.jpg";

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is actually in a session or recovery mode
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // If they just clicked the link, Supabase often sets the session automatically
        // via the URL fragment #access_token
        // But if it's completely missing after mounting, they shouldn't be here.
        // We'll trust the auth state listener under the hood if the user is present.
      }
    };
    checkSession();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        style: { background: '#ffffff', color: '#EF4444', border: '1px solid #EF4444' }
      });
      return;
    }

    setIsSubmitting(true);
    
    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      toast.error(error.message, {
        style: { background: '#ffffff', color: '#EF4444', border: '1px solid #EF4444' }
      });
    } else {
      toast.success("Password updated successfully!", { 
        style: { background: '#ffffff', color: '#18181b', border: '1px solid #7C3AED' } 
      });
      // Sign them out so they can explicitly log back in, or redirect to admin
      await supabase.auth.signOut();
      navigate("/admin/login");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary transition-colors duration-300 relative px-4">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-violet/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="bg-primary transition-colors duration-300 w-full max-w-md p-8 md:p-10 rounded-3xl border border-black/5 shadow-[0_20px_50px_rgba(0,0,0,0.08)] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="HTR Properties" className="h-20 w-auto object-contain mb-4" />
          <p className="text-chrome/50 text-sm font-mono mt-2 tracking-widest uppercase">
            Update Password
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-chrome/70 text-sm mb-2">New Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-xl py-3 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors" 
              placeholder="••••••••"
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-chrome/70 text-sm mb-2">Confirm New Password</label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-xl py-3 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors" 
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all flex justify-center items-center gap-2 group disabled:opacity-70 mt-4"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" /> Update Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
