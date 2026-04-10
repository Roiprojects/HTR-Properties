import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, Eye, EyeOff, AlertTriangle, Star, Quote, PlayCircle } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

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
  status: "Active" | "Inactive";
  date: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("All Ratings");
  const [typeFilter, setTypeFilter] = useState("All Types");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    clientName: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=1",
    type: "Text",
    reference: "",
    status: "Active"
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error("Error fetching testimonials:", error);
    }
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
        reference: d.reference,
        status: d.status,
        date: new Date(d.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      })));
    }
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      clientName: "",
      role: "",
      company: "",
      content: "",
      rating: 5,
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`,
      type: "Text",
      reference: "",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const { error } = await supabase.from('testimonials').update({
        client_name: formData.clientName,
        role: formData.role,
        company: formData.company,
        content: formData.content,
        rating: formData.rating,
        avatar: formData.avatar,
        type: formData.type,
        reference: formData.reference,
        status: formData.status
      }).eq('id', editingItem.id);
      
      if (!error) {
        setTestimonials(testimonials.map(t => t.id === editingItem.id ? { ...t, ...formData } as Testimonial : t));
        toast.success("Testimonial updated successfully");
      } else {
        toast.error("Failed to update testimonial");
      }
    } else {
      const { data, error } = await supabase.from('testimonials').insert([{
        client_name: formData.clientName,
        role: formData.role,
        company: formData.company,
        content: formData.content,
        rating: formData.rating,
        avatar: formData.avatar,
        type: formData.type,
        reference: formData.reference,
        status: formData.status
      }]).select('*').single();
      
      if (!error && data) {
        const newItem = {
          ...formData,
          id: data.id,
          date: new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
        } as Testimonial;
        setTestimonials([newItem, ...testimonials]);
        toast.success("New testimonial added");
      } else {
        toast.error("Failed to add testimonial");
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      const { error } = await supabase.from('testimonials').delete().eq('id', deleteId);
      if (!error) {
        setTestimonials(testimonials.filter(t => t.id !== deleteId));
        toast.success("Testimonial removed");
      } else {
        toast.error("Failed to delete");
      }
      setDeleteId(null);
    }
  };

  const toggleVisibility = async (item: Testimonial) => {
    const newStatus = item.status === "Active" ? "Inactive" : "Active";
    const { error } = await supabase.from('testimonials').update({ status: newStatus }).eq('id', item.id);
    if (!error) {
      setTestimonials(testimonials.map(t => t.id === item.id ? { ...t, status: newStatus as any } : t));
      toast.success(`Visibility set to ${newStatus}`);
    } else {
      toast.error("Failed to update status");
    }
  };

  const filteredItems = testimonials.filter(item => {
    const matchesSearch = item.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const ratingNum = parseInt(ratingFilter);
    const matchesRating = ratingFilter === "All Ratings" || item.rating === ratingNum;
    const matchesType = typeFilter === "All Types" || item.type === typeFilter;
    return matchesSearch && matchesRating && matchesType;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-serif text-chrome">Clients Testimonials</h2>
        <button 
          onClick={handleAddNew}
          className="px-4 py-2 bg-gradient-to-r from-accent-violet to-accent-teal rounded-lg text-white font-medium text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="bg-primary transition-colors duration-300 border border-black/5 rounded-2xl flex-1 flex flex-col overflow-hidden shadow-sm">
        {/* Top Bar */}
        <div className="p-4 border-b border-black/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome/50" />
            <input 
              type="text" 
              placeholder="Search by name or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/5 border border-black/10 rounded-lg py-2 pl-9 pr-4 text-chrome text-sm focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-chrome text-sm focus:outline-none flex-1 md:flex-none"
            >
              <option>All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
            </select>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-chrome text-sm focus:outline-none flex-1 md:flex-none"
            >
              <option>All Types</option>
              <option>Text</option>
              <option>Video</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-chrome border-collapse min-w-[900px]">
            <thead className="text-xs uppercase bg-black/5 text-chrome/60 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Testimonial</th>
                <th className="px-4 py-3 font-medium text-center">Rating</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} className="border-b border-black/5 hover:bg-black/5 transition-colors group">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={item.avatar} className="w-10 h-10 rounded-full border border-black/10" alt="" />
                      <div>
                        <div className="font-medium text-chrome">{item.clientName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 max-w-xs xl:max-w-md">
                    <div className="text-chrome/70 line-clamp-2 text-xs italic">"{item.content}"</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-0.5 text-accent-violet">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < item.rating ? 'fill-current' : 'opacity-20'}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded text-[10px] font-mono tracking-wider transition-colors ${
                      item.type === "Video" ? 'bg-accent-teal/10 text-accent-teal border border-accent-teal/20' : 'bg-black/5 text-chrome/60 border border-black/10'
                    }`}>
                      {item.type === "Video" ? <PlayCircle className="w-3 h-3" /> : <Quote className="w-3 h-3" />}
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 border rounded-md text-[10px] font-mono uppercase tracking-widest ${
                      item.status === "Active" ? "bg-green-400/10 text-green-400 border-green-400/20" : "bg-chrome/10 text-chrome border-chrome/20"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleVisibility(item)}
                        className="p-1.5 hover:bg-primary transition-colors duration-300/10 rounded text-chrome hover:text-white transition-colors cursor-pointer" title="Toggle Visibility"
                      >
                        {item.status === "Active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleEdit(item)}
                        className="p-1.5 hover:bg-primary transition-colors duration-300/10 rounded text-chrome hover:text-accent-teal transition-colors cursor-pointer" title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
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
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-primary transition-colors duration-300 border border-black/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h3 className="text-xl font-serif text-chrome">{editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-chrome hover:text-accent-teal transition-colors text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Client Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.clientName}
                    onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                  />
                </div>
                


                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Testimonial Content</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Rating</label>
                  <select 
                    value={formData.rating}
                    onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                  >
                    {[1,2,3,4,5].map(r => <option key={r} value={r}>{r} Stars</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                  >
                    <option>Text</option>
                    <option>Video</option>
                  </select>
                </div>



                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-black/5 border border-black/10 rounded-lg py-2 px-4 text-chrome focus:outline-none focus:border-accent-violet transition-colors"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
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
                  {editingItem ? 'Update Testimonial' : 'Add Testimonial'}
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
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-xl font-serif text-chrome mb-2">Delete Testimonial?</h3>
            <p className="text-chrome/70 text-sm mb-6">
              This will permanently remove this client's success story. This action cannot be undone.
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