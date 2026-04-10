import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { Save, Globe, Share2, Info, ShieldCheck, Mail, Phone, MessageSquare, MapPin, Instagram, Facebook, Youtube, Linkedin, Twitter, Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useSettings } from "../../contexts/SettingsContext";

export default function Settings() {
  const { refreshSettings } = useSettings();
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState({
    siteName: "HTR Properties",
    contactEmail: "hello@antigravity.in",
    contactPhone: "+91 98866 61254",
    whatsapp: "https://wa.me/919886661254",
    address: "#1294, 1st Floor, 7th Main Rd, A Block, Milk Colony, 2nd Stage, Rajajinagar, Bengaluru, Karnataka 560010",
    instagram: "https://instagram.com/htrproperties",
    facebook: "https://www.facebook.com/htrproperties2018/",
    youtube: "https://www.youtube.com/@htrproperties1324",
    linkedin: "https://linkedin.com/company/htrproperties",
    twitter: "https://twitter.com/htrproperties",
    metaTitle: "HTR Properties | Premium Real Estate",
    metaDescription: "Experience gravity-defying architecture and unrestricted luxury with HTR Properties.",
    maintenanceMode: false,
    heroImages: [] as string[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
      
      if (error) {
        if (error.code !== 'PGRST116') throw error; // No row found
      }
      
      if (data) {
        setSettings({
          siteName: data.site_name,
          contactEmail: data.contact_email,
          contactPhone: data.contact_phone,
          whatsapp: data.whatsapp,
          address: data.address,
          instagram: data.instagram,
          facebook: data.facebook,
          youtube: data.youtube,
          linkedin: data.linkedin,
          twitter: data.twitter,
          metaTitle: data.meta_title,
          metaDescription: data.meta_description,
          maintenanceMode: data.maintenance_mode,
          heroImages: data.hero_images || []
        });
      }
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const filesArray = Array.from(e.target.files);
    toast.loading(`Uploading ${filesArray.length} image(s)...`, { id: "upload-hero" });

    try {
      const uploadPromises = filesArray.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `hero_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);
          
        return publicUrl;
      });

      const newUrls = await Promise.all(uploadPromises);
      setSettings(prev => ({
        ...prev,
        heroImages: [...prev.heroImages, ...newUrls]
      }));
      
      toast.success("Hero images uploaded successfully", { id: "upload-hero" });
    } catch (error: any) {
      toast.error("Upload failed: " + error.message, { id: "upload-hero" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeHeroImage = (index: number) => {
    setSettings(prev => {
      const updated = [...prev.heroImages];
      updated.splice(index, 1);
      return { ...prev, heroImages: updated };
    });
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const { error } = await supabase.from('settings').upsert({
        id: 1,
        site_name: settings.siteName,
        contact_email: settings.contactEmail,
        contact_phone: settings.contactPhone,
        whatsapp: settings.whatsapp,
        address: settings.address,
        instagram: settings.instagram,
        facebook: settings.facebook,
        youtube: settings.youtube,
        linkedin: settings.linkedin,
        twitter: settings.twitter,
        meta_title: settings.metaTitle,
        meta_description: settings.metaDescription,
        maintenance_mode: settings.maintenanceMode,
        hero_images: settings.heroImages,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

      if (error) throw error;
      await refreshSettings();
      toast.success("Settings updated successfully");
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Info },
    { id: "appearance", label: "Appearance", icon: ImageIcon },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "seo", label: "SEO & Global", icon: Globe },
    { id: "security", label: "Security", icon: ShieldCheck },
  ];

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif text-chrome">System Settings</h2>
          <p className="text-chrome/50 text-sm">Manage your website's global configuration and branding</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-gradient-to-r from-accent-violet to-accent-teal rounded-lg text-white font-medium text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === tab.id
                  ? 'bg-accent-violet/10 text-accent-violet border border-accent-violet/20'
                  : 'text-chrome/60 hover:text-chrome hover:bg-black/5'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-primary transition-colors duration-300 border border-black/5 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <form onSubmit={handleSave} className="p-6 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">

            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full bg-black/5 border border-black/10 rounded-lg py-2.5 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-chrome/50 mb-2">
                        <Mail className="w-3 h-3" /> Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-chrome/50 mb-2">
                        <Phone className="w-3 h-3" /> Contact Phone
                      </label>
                      <input
                        type="text"
                        value={settings.contactPhone}
                        onChange={e => setSettings({ ...settings, contactPhone: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-chrome/50 mb-2">
                      <MessageSquare className="w-3 h-3" /> WhatsApp Link
                    </label>
                    <input
                      type="url"
                      value={settings.whatsapp}
                      onChange={e => setSettings({ ...settings, whatsapp: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-chrome/50 mb-2">
                      <MapPin className="w-3 h-3" /> Office Address
                    </label>
                    <textarea
                      rows={3}
                      value={settings.address}
                      onChange={e => setSettings({ ...settings, address: e.target.value })}
                      className="w-full bg-black/5 border border-black/10 rounded-lg py-2.5 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-chrome font-medium">Hero Section Images</h3>
                      <p className="text-chrome/50 text-xs mt-1">Manage the image slider on the homepage. First image is shown initially.</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="px-4 py-2 bg-black/5 hover:bg-black/10 border border-black/10 rounded-lg text-chrome text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {isUploading ? 'Uploading...' : 'Upload Images'}
                    </button>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      multiple
                      onChange={handleHeroImageUpload}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>

                  {settings.heroImages.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-black/5 p-4 rounded-xl border border-black/10">
                      {settings.heroImages.map((url, i) => (
                        <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-black/10 group bg-primary">
                          <img src={url} className="w-full h-full object-cover" alt={`Hero ${i + 1}`} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={() => removeHeroImage(i)}
                              className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors shadow-lg transform scale-50 group-hover:scale-100 duration-200"
                              title="Remove Image"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 rounded backdrop-blur-md text-white text-[10px] font-mono tracking-widest uppercase shadow-sm">
                            Slide {i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="w-full aspect-[21/9] border-2 border-dashed border-black/10 rounded-xl flex flex-col items-center justify-center gap-3 bg-black/5">
                      <ImageIcon className="w-10 h-10 text-chrome/20" />
                      <div className="text-center px-4">
                        <p className="text-chrome text-sm font-medium">No hero images uploaded</p>
                        <p className="text-chrome/40 text-xs mt-1">Default placeholder images will be used on the site.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: 'instagram', icon: Instagram, label: 'Instagram', color: 'text-pink-500' },
                    { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'text-blue-600' },
                    { id: 'youtube', icon: Youtube, label: 'YouTube', color: 'text-red-600' },
                    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'text-blue-700' },
                    { id: 'twitter', icon: Twitter, label: 'X (Twitter)', color: 'text-white' },
                  ].map(social => (
                    <div key={social.id}>
                      <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-chrome/50 mb-2">
                        <social.icon className={`w-3 h-3 ${social.color}`} /> {social.label} URL
                      </label>
                      <input
                        type="url"
                        value={(settings as any)[social.id]}
                        onChange={e => setSettings({ ...settings, [social.id]: e.target.value })}
                        className="w-full bg-black/5 border border-black/10 rounded-lg py-2.5 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "seo" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-2">Global Meta Title</label>
                    <input
                      type="text"
                      value={settings.metaTitle}
                      onChange={e => setSettings({ ...settings, metaTitle: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-2">Global Meta Description</label>
                    <textarea
                      rows={4}
                      value={settings.metaDescription}
                      onChange={e => setSettings({ ...settings, metaDescription: e.target.value })}
                      className="w-full bg-black/5 border border-black/10 rounded-lg py-2.5 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <h4 className="text-chrome font-medium text-sm">Maintenance Mode</h4>
                      <p className="text-chrome/40 text-xs">When enabled, visitors will see a coming soon page.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${settings.maintenanceMode ? 'bg-accent-violet' : 'bg-primary transition-colors duration-300/10'
                        }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-primary transition-colors duration-300 shadow-sm transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-chrome/40" />
                </div>
                <div>
                  <h4 className="text-chrome font-medium">Security Options</h4>
                  <p className="text-chrome/40 text-sm max-w-xs mx-auto">Advance security settings like 2FA and API Access key rotation are available in the Cloud Console.</p>
                </div>
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}