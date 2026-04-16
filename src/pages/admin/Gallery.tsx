import { useState, useRef, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, AlertTriangle, Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

interface GalleryImage {
  id: string;
  title: string;
  url: string;
  category: string;
  status: string;
  created_at: string;
}

const CATEGORIES = ["Residential", "Commercial", "Interiors", "Exteriors", "Amenities"];

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreviews, setSelectedPreviews] = useState<{file: File, url: string}[]>([]);

  const [formData, setFormData] = useState<Partial<GalleryImage>>({
    title: "",
    category: "Residential",
    status: "Active"
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch gallery: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (img: GalleryImage) => {
    setEditingImage(img);
    setFormData(img);
    setSelectedPreviews([]);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingImage(null);
    setFormData({
      title: "",
      category: "Residential",
      status: "Active"
    });
    setSelectedPreviews([]);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newPreviews = filesArray.map(file => ({
        file,
        url: URL.createObjectURL(file)
      }));
      setSelectedPreviews([...selectedPreviews, ...newPreviews]);
    }
  };

  const removePreview = (index: number) => {
    const updated = [...selectedPreviews];
    URL.revokeObjectURL(updated[index].url);
    updated.splice(index, 1);
    setSelectedPreviews(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingImage) {
        // Update single image
        let finalUrl = editingImage.url;
        
        if (selectedPreviews.length > 0) {
          toast.loading("Uploading new image...", { id: "upload" });
          const file = selectedPreviews[0].file;
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);
            
          finalUrl = publicUrl; 
          toast.dismiss("upload");
        }

        const { error } = await supabase
          .from('gallery')
          .update({
            title: formData.title,
            category: formData.category,
            status: formData.status,
            url: finalUrl
          })
          .eq('id', editingImage.id);

        if (error) throw error;
        toast.success("Image updated successfully");
      } else {
        // Add multiple images
        if (selectedPreviews.length === 0) {
          toast.error("Please select at least one image");
          return;
        }

        toast.loading(`Uploading ${selectedPreviews.length} images...`, { id: "upload" });
        
        // Upload all files first
        const uploadPromises = selectedPreviews.map(async (preview, index) => {
          const file = preview.file;
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${index}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, file);
            
          if (uploadError) throw uploadError;
          
          const { data: { publicUrl } } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName);
            
          return {
            title: formData.title || `Gallery Image ${Date.now()}_${index}`,
            url: publicUrl,
            category: formData.category || "Residential",
            status: formData.status || "Active",
          };
        });

        const newEntries = await Promise.all(uploadPromises);
        toast.dismiss("upload");

        const { error } = await supabase
          .from('gallery')
          .insert(newEntries);

        if (error) throw error;
        toast.success(`${newEntries.length} images added to gallery`);
      }
      setIsModalOpen(false);
      fetchImages();
    } catch (error: any) {
      toast.dismiss("upload");
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
        .from('gallery')
        .delete()
        .eq('id', deleteId);

      if (error) throw error;
      toast.success("Image removed");
      setDeleteId(null);
      fetchImages();
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  const toggleVisibility = async (img: GalleryImage) => {
    const newStatus = img.status === "Active" ? "Inactive" : "Active";
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ status: newStatus })
        .eq('id', img.id);

      if (error) throw error;
      toast.success(`Visibility set to ${newStatus}`);
      fetchImages();
    } catch (error: any) {
      toast.error("Toggle failed: " + error.message);
    }
  };

  const filteredImages = images.filter(img => {
    const matchesSearch = img.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || img.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-serif text-chrome">Gallery Management</h2>
        <button 
          onClick={handleAddNew}
          className="px-4 py-2 bg-gradient-to-r from-accent-violet to-accent-teal rounded-lg text-white font-medium text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Image
        </button>
      </div>

      <div className="bg-primary transition-colors duration-300 border border-black/5 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
        {/* Top Bar */}
        <div className="p-4 border-b border-black/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome/50" />
            <input 
              type="text" 
              placeholder="Search images..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-lg py-2 pl-9 pr-4 text-chrome text-sm focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-chrome text-sm focus:outline-none flex-1 md:flex-none"
            >
              <option>All Categories</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar w-full relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-chrome/40 space-y-4">
              <Loader2 className="w-10 h-10 animate-spin" />
              <p>Fetching collection...</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-chrome border-collapse min-w-[800px]">
              <thead className="text-xs uppercase bg-black/5 text-chrome/60 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-4 py-3 font-medium w-10 text-center">Preview</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Upload Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredImages.map(img => (
                  <tr key={img.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                    <td className="px-4 py-4">
                      <div className="w-16 h-10 rounded border border-black/10 overflow-hidden bg-black/5 mx-auto">
                        <img src={img.url} className="w-full h-full object-cover" alt={img.title} />
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-chrome">{img.title}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-accent-violet/10 text-accent-violet border border-accent-violet/20 rounded text-xs">
                        {img.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-chrome/50 font-mono text-xs">
                      {new Date(img.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 border rounded-md text-xs font-mono uppercase tracking-widest ${
                        img.status === "Active" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-chrome/10 text-chrome border-chrome/20"
                      }`}>
                        {img.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => toggleVisibility(img)}
                          className="p-1.5 hover:bg-primary transition-colors duration-300/10 rounded text-chrome hover:text-white transition-colors cursor-pointer" title="Toggle Visibility"
                        >
                          {img.status === "Active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleEdit(img)}
                          className="p-1.5 hover:bg-primary transition-colors duration-300/10 rounded text-chrome hover:text-accent-teal transition-colors cursor-pointer" title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(img.id)}
                          className="p-1.5 hover:bg-destructive/20 rounded text-chrome hover:text-destructive transition-colors cursor-pointer" title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filteredImages.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-chrome/30">
                      <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>No images found matching your search</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Footer Info */}
        <div className="p-4 border-t border-black/5 flex justify-between items-center text-sm text-chrome/50">
          <span>Showing {filteredImages.length} of {images.length} collection images</span>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-primary transition-colors duration-300 border border-black/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h3 className="text-xl font-serif text-chrome">{editingImage ? 'Edit Image' : 'Add Multiple Images'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-chrome hover:text-accent-teal transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Common Title (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Modern Villa Penthouse"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  />
                  {!editingImage && <p className="mt-1 text-[10px] text-chrome/30">If left blank, images will be named numerically.</p>}
                </div>
                
                {/* Upload Area */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">
                    {editingImage ? 'Change Image' : 'Select Images'}
                  </label>
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-black/10 rounded-xl flex flex-col items-center justify-center gap-3 bg-black/5 hover:bg-black/10 hover:border-accent-violet/40 transition-all cursor-pointer group"
                  >
                    <Upload className="w-8 h-8 text-chrome/30 group-hover:text-accent-violet transition-colors" />
                    <div className="text-center px-4">
                      <p className="text-chrome text-sm font-medium">Click to browse files</p>
                      <p className="text-chrome/30 text-xs mt-1">Supports multiple JPG, PNG, WEBP selections</p>
                    </div>
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    multiple={!editingImage}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Display Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Previews Grid */}
              {(selectedPreviews.length > 0 || editingImage) && (
                <div className="p-3 border border-black/5 bg-black/5 rounded-lg max-h-48 overflow-y-auto custom-scrollbar">
                  <p className="text-[10px] font-mono text-chrome/40 mb-3 uppercase tracking-wide">Selected Image Previews:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {editingImage && selectedPreviews.length === 0 && (
                      <div className="relative aspect-square rounded overflow-hidden border border-white/5 bg-primary transition-colors duration-300/5">
                        <img src={editingImage.url} className="w-full h-full object-cover" alt="" />
                        <div className="absolute top-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] text-white">Current</div>
                      </div>
                    )}
                    {selectedPreviews.map((preview, i) => (
                      <div key={i} className="relative aspect-square rounded overflow-hidden border border-white/10 bg-primary transition-colors duration-300/5 group/preview">
                        <img src={preview.url} className="w-full h-full object-cover" alt="" />
                        <button 
                          type="button"
                          onClick={() => removePreview(i)}
                          className="absolute top-1 right-1 p-1 bg-red-500 rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                  {editingImage ? 'Update Image' : `Add ${selectedPreviews.length > 0 ? selectedPreviews.length : ''} to Gallery`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setDeleteId(null)}></div>
          <div className="relative w-full max-w-sm bg-primary transition-colors duration-300 border border-black/5 rounded-2xl p-6 text-center shadow-2xl">
            <div className="w-16 h-16 bg-red-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-serif text-chrome mb-2">Delete from Gallery?</h3>
            <p className="text-chrome/70 text-sm mb-6">
              This will remove the image from your public gallery. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-lg border border-black/10 text-chrome hover:bg-black/5 transition-all"
              >
                No, Keep
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-all"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}