import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, AlertTriangle, Loader2, Image as ImageIcon, X, Check, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

interface Property {
  id: string;
  property_id?: string;
  title: string;
  slug: string;
  level: string;
  type: string;
  bhk: string;
  sq_ft?: string;
  price: string;
  status: string;
  images: string[];
  description?: string;
  amenities?: string[];
  location?: any;
  created_at: string;
  featured?: boolean;
}

interface PropertyFormData extends Partial<Property> {
  amenitiesText?: string;
  locationText?: string;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<PropertyFormData>({
    property_id: "",
    title: "",
    level: "Level A",
    type: "Residential",
    bhk: "3 BHK",
    sq_ft: "",
    price: "",
    status: "Active",
    images: [],
    description: "",
    amenitiesText: "",
    locationText: "",
    featured: false
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProperties(data || []);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to load properties: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGalleryForPicker = async () => {
    try {
      setGalleryLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('id, url, title')
        .eq('status', 'Active');
      if (error) throw error;
      setGalleryImages(data || []);
      setIsGalleryPickerOpen(true);
    } catch (error: any) {
      toast.error("Failed to fetch gallery: " + error.message);
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleEdit = (prop: Property) => {
    setEditingProperty(prop);
    setFormData({
      ...prop,
      property_id: prop.property_id || "",
      sq_ft: prop.sq_ft || "",
      amenitiesText: prop.amenities?.join(', ') || "",
      locationText: prop.location?.address || "",
      featured: prop.featured || false
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProperty(null);
    setFormData({
      property_id: "",
      title: "",
      level: "Level A",
      type: "Residential",
      bhk: "3 BHK",
      sq_ft: "",
      price: "",
      status: "Active",
      images: [],
      description: "",
      amenitiesText: "",
      locationText: "",
      featured: false
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const slug = formData.title?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') || `prop-${Date.now()}`;
      
      const payload = {
        title: formData.title,
        slug: editingProperty ? formData.slug : slug,
        level: formData.level,
        type: formData.type,
        bhk: formData.bhk,
        sq_ft: formData.sq_ft,
        price: formData.price,
        status: formData.status,
        images: formData.images || [],
        description: formData.description || "",
        amenities: formData.amenitiesText ? formData.amenitiesText.split(',').map(s => s.trim()).filter(Boolean) : [],
        location: { address: formData.locationText || "" },
        featured: formData.featured || false
      };

      if (editingProperty) {
        const { error } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', editingProperty.id);
        if (error) throw error;
        toast.success("Property updated successfully");
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([payload]);
        if (error) throw error;
        toast.success("New property created");
      }
      setIsModalOpen(false);
      fetchProperties();
    } catch (error: any) {
      toast.error("Save failed: " + error.message);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', deleteId);
      if (error) throw error;
      toast.success("Property deleted");
      setDeleteId(null);
      fetchProperties();
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  const toggleVisibility = async (prop: Property) => {
    const newStatus = prop.status === "Active" ? "Inactive" : "Active";
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: newStatus })
        .eq('id', prop.id);
      if (error) throw error;
      toast.success(`Visibility set to ${newStatus}`);
      fetchProperties();
    } catch (error: any) {
      toast.error("Toggle failed: " + error.message);
    }
  };

  const toggleImageSelection = (url: string) => {
    const currentImages = formData.images || [];
    if (currentImages.includes(url)) {
      setFormData({ ...formData, images: currentImages.filter(img => img !== url) });
    } else {
      setFormData({ ...formData, images: [...currentImages, url] });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('gallery')
          .getPublicUrl(filePath);

        newUrls.push(publicUrl);

        // Also register in gallery table
        await supabase.from('gallery').insert([{
          title: file.name.split('.')[0],
          url: publicUrl,
          category: 'Property',
          status: 'Active'
        }]);
      }

      setFormData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...newUrls]
      }));
      toast.success(`${files.length} images uploaded and added`);
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || prop.status === statusFilter;
    const matchesLevel = levelFilter === "All Levels" || prop.level === levelFilter;
    return matchesSearch && matchesStatus && matchesLevel;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "bg-green-400/10 text-green-400 border-green-400/20";
      case "Inactive": return "bg-chrome/10 text-chrome border-chrome/20";
      case "Sold": return "bg-red-400/10 text-red-400 border-red-400/20";
      case "Rented": return "bg-accent-teal/10 text-accent-teal border-accent-teal/20";
      default: return "";
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-serif text-chrome">Properties Management</h2>
        <button 
          onClick={handleAddNew}
          className="px-4 py-2 bg-gradient-to-r from-accent-violet to-accent-teal rounded-lg text-white font-medium text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Property
        </button>
      </div>

      <div className="bg-primary transition-colors duration-300 border border-black/5 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
        {/* Top Bar */}
        <div className="p-4 border-b border-black/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome/50" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-lg py-2 pl-9 pr-4 text-chrome text-sm focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-chrome text-sm focus:outline-none flex-1 md:flex-none"
            >
              <option>All Levels</option>
              <option>Level A</option>
              <option>Level B</option>
              <option>Level C</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-chrome text-sm focus:outline-none flex-1 md:flex-none"
            >
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Sold</option>
              <option>Rented</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar w-full relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-chrome/40 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p>Fetching properties...</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-[400px]">
              {filteredProperties.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-chrome/40 py-20 px-4 text-center">
                  <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 opacity-20" />
                  </div>
                  <h3 className="text-lg font-serif text-chrome mb-1">No Properties Found</h3>
                  <p className="text-sm max-w-xs">Start building your portfolio by adding your first property listing.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm text-chrome border-collapse min-w-[800px]">
                  <thead className="text-xs uppercase bg-black/5 text-chrome/60 sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="px-4 py-3 font-medium">Property</th>
                      <th className="px-4 py-3 font-medium text-center">Images</th>
                      <th className="px-4 py-3 font-medium">Level</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">BHK</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium text-center">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProperties.map(prop => (
                      <tr key={prop.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded border border-black/10 overflow-hidden bg-black/5">
                              {prop.images && prop.images.length > 0 ? (
                                <img src={prop.images[0]} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-black/5">
                                  <ImageIcon className="w-4 h-4 text-chrome/20" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col items-start gap-1">
                              <span className="font-medium text-chrome">{prop.title}</span>
                              {prop.featured && (
                                <span className="px-1.5 py-0.5 bg-accent-violet/10 text-accent-violet rounded text-[9px] font-mono tracking-widest uppercase border border-accent-violet/20">Featured</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span className="px-2 py-0.5 bg-black/5 rounded-full text-[10px] font-mono border border-black/10">
                            {prop.images?.length || 0} Assets
                          </span>
                        </td>
                        <td className="px-4 py-4"><span className="px-2 py-1 bg-black/5 rounded text-xs">{prop.level}</span></td>
                        <td className="px-4 py-4">{prop.type}</td>
                        <td className="px-4 py-4 font-mono text-xs">{prop.bhk}</td>
                        <td className="px-4 py-4 text-chrome font-medium">{prop.price}</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`px-2.5 py-1 border rounded-md text-xs font-mono uppercase tracking-widest ${getStatusColor(prop.status)}`}>
                            {prop.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => toggleVisibility(prop)}
                              className="p-1.5 hover:bg-primary transition-colors duration-300/10 rounded text-chrome hover:text-white transition-colors cursor-pointer" title="Toggle Visibility"
                            >
                              {prop.status === "Active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button 
                              onClick={() => handleEdit(prop)}
                              className="p-1.5 hover:bg-primary transition-colors duration-300/10 rounded text-chrome hover:text-accent-teal transition-colors cursor-pointer" title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(prop.id)}
                              className="p-1.5 hover:bg-destructive/20 rounded text-chrome hover:text-destructive transition-colors cursor-pointer" title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
        
        {/* Footer Info */}
        <div className="p-4 border-t border-black/5 flex justify-between items-center text-sm text-chrome/50">
          <span>Showing {filteredProperties.length} of {properties.length} entries</span>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-primary transition-colors duration-300 border border-black/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h3 className="text-xl font-serif text-chrome">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-chrome hover:text-accent-teal text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Property Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Level</label>
                  <select 
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  >
                    <option>Level A</option>
                    <option>Level B</option>
                    <option>Level C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Villa</option>
                    <option>Studio</option>
                    <option>Plot</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">BHK / Config</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 3 BHK"
                    value={formData.bhk}
                    onChange={e => setFormData({ ...formData, bhk: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Square Feet (Area)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 2400 sq.ft."
                    value={formData.sq_ft}
                    onChange={e => setFormData({ ...formData, sq_ft: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Price</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ₹4.2 Cr"
                    required
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Sold</option>
                    <option>Rented</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Enter property description..."
                    value={formData.description || ""}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors custom-scrollbar"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Amenities (Comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Infinity Pool, Smart Home, Gym"
                    value={formData.amenitiesText || ""}
                    onChange={e => setFormData({ ...formData, amenitiesText: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Location Address</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 45 Mg Road, Bangalore Central"
                    value={formData.locationText || ""}
                    onChange={e => setFormData({ ...formData, locationText: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  />
                </div>

                <div className="md:col-span-2 flex items-center gap-3 mt-2 bg-black/5 p-4 rounded-lg border border-black/5">
                  <input 
                    type="checkbox"
                    id="featuredProp"
                    checked={formData.featured || false}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 bg-white border border-black/10 rounded focus:ring-accent-violet accent-accent-violet transition-colors cursor-pointer"
                  />
                  <label htmlFor="featuredProp" className="text-sm font-medium text-chrome cursor-pointer flex-1 flex flex-col sm:flex-row sm:items-center gap-1">
                    Featured Property 
                    <span className="text-xs text-chrome/50 font-normal sm:ml-2">
                       (Display this property in the featured section on the home page)
                    </span>
                  </label>
                </div>

                <div className="md:col-span-2 pt-2">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50">Property Gallery</label>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={fetchGalleryForPicker}
                        className="text-[10px] font-mono uppercase tracking-widest text-accent-teal hover:text-white transition-colors flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3" /> Select from Gallery
                      </button>
                      <label className="text-[10px] font-mono uppercase tracking-widest text-accent-violet hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
                        {isUploading ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Upload className="w-3 h-3" />
                        )}
                        Upload from Device
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 p-3 bg-black/5 border border-black/5 rounded-xl min-h-[100px]">
                    {formData.images && formData.images.length > 0 ? (
                      formData.images.map((url, i) => (
                        <div key={i} className="relative aspect-square rounded overflow-hidden border border-white/10 group/img">
                          <img src={url} className="w-full h-full object-cover" alt="" />
                          <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, images: formData.images?.filter(img => img !== url) })}
                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity"
                          >
                            <X className="w-2.5 h-2.5 text-white" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-4 flex flex-col items-center justify-center text-chrome/20 space-y-2 py-4">
                        <ImageIcon className="w-6 h-6" />
                        <p className="text-[10px] uppercase tracking-tighter">No images attached</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg border border-black/10 text-chrome hover:bg-black/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-accent-violet to-accent-teal text-white font-medium hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all"
                >
                  {editingProperty ? 'Update Property' : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Picker Modal */}
      {isGalleryPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsGalleryPickerOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-primary transition-colors duration-300 border border-black/5 rounded-2xl overflow-hidden flex flex-col h-[70vh] shadow-2xl">
            <div className="p-6 border-b border-black/5 flex justify-between items-center text-chrome">
              <h3 className="text-xl font-serif">Select Gallery Images</h3>
              <button onClick={() => setIsGalleryPickerOpen(false)} className="text-2xl hover:text-accent-teal transition-colors">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {galleryLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-chrome/40 space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <p>Opening gallery collection...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {galleryImages.map(img => (
                    <div 
                      key={img.id}
                      onClick={() => toggleImageSelection(img.url)}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        formData.images?.includes(img.url) ? 'border-accent-teal ring-2 ring-accent-teal/20' : 'border-white/5 hover:border-white/20'
                      }`}
                    >
                      <img src={img.url} className="w-full h-full object-cover" alt="" />
                      {formData.images?.includes(img.url) && (
                        <div className="absolute inset-0 bg-accent-teal/20 flex items-center justify-center backdrop-blur-[2px]">
                          <div className="bg-accent-teal text-white rounded-full p-1 shadow-lg">
                            <Check className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-[10px] text-white truncate font-medium">{img.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-black/5 bg-black/5 flex justify-between items-center">
              <span className="text-sm text-chrome/60 font-mono italic">
                {formData.images?.length || 0} images selected
              </span>
              <button 
                onClick={() => setIsGalleryPickerOpen(false)}
                className="px-8 py-2 bg-accent-teal rounded-lg text-white font-medium hover:bg-accent-teal/80 transition-all"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
          <div className="relative w-full max-w-sm bg-primary transition-colors duration-300 border border-black/5 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-serif text-chrome mb-2">Delete Property?</h3>
            <p className="text-chrome/70 text-sm mb-6">
              This will permanently remove the property and all its connections from the database.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-lg border border-white/10 text-chrome hover:text-white hover:bg-primary transition-colors duration-300/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}