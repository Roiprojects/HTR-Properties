import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

const mockProperties = [
  { id: 1, title: "Skyline Penthouse", level: "Level A", type: "Residential", bhk: "3 BHK", price: "₹4.2 Cr", status: "Active", date: "Oct 12, 2025" },
  { id: 2, title: "Corporate Tower Suite", level: "Level A", type: "Commercial", bhk: "-", price: "₹1.8L/mo", status: "Rented", date: "Oct 10, 2025" },
  { id: 3, title: "Serene Heights Apartment", level: "Level B", type: "Residential", bhk: "2 BHK", price: "₹1.1 Cr", status: "Active", date: "Oct 08, 2025" },
  { id: 4, title: "Green Valley Villa", level: "Level B", type: "Residential", bhk: "4 BHK", price: "₹85k/mo", status: "Inactive", date: "Oct 05, 2025" },
  { id: 5, title: "Compact Studio", level: "Level C", type: "Residential", bhk: "1 BHK", price: "₹45 L", status: "Sold", date: "Sep 28, 2025" },
];

interface Property {
  id: number;
  title: string;
  level: string;
  type: string;
  bhk: string;
  price: string;
  status: string;
  date: string;
}

export default function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({
    title: "",
    level: "Level A",
    type: "Residential",
    bhk: "3 BHK",
    price: "",
    status: "Active"
  });

  const handleEdit = (prop: Property) => {
    setEditingProperty(prop);
    setFormData(prop);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingProperty(null);
    setFormData({
      title: "",
      level: "Level A",
      type: "Residential",
      bhk: "3 BHK",
      price: "",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProperty) {
      setProperties(properties.map(p => p.id === editingProperty.id ? { ...p, ...formData } as Property : p));
      toast.success("Property updated successfully");
    } else {
      const newProperty = {
        ...formData,
        id: Math.max(...properties.map(p => p.id), 0) + 1,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      } as Property;
      setProperties([newProperty, ...properties]);
      toast.success("New property added successfully");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      setProperties(properties.filter(p => p.id !== id));
      toast.success("Property deleted");
    }
  };

  const toggleVisibility = (prop: Property) => {
    const newStatus = prop.status === "Active" ? "Inactive" : "Active";
    setProperties(properties.map(p => p.id === prop.id ? { ...p, status: newStatus } : p));
    toast.success(`Visibility toggled to ${newStatus}`);
  };

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || prop.status === statusFilter;
    return matchesSearch && matchesStatus;
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
        <h2 className="text-2xl font-serif text-white">Properties Management</h2>
        <button 
          onClick={handleAddNew}
          className="px-4 py-2 bg-gradient-to-r from-accent-violet to-accent-teal rounded-lg text-white font-medium text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Property
        </button>
      </div>

      <div className="glass-card bg-[#0F0F1A]/50 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome/50" />
            <input 
              type="text" 
              placeholder="Search properties..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-accent-violet transition-colors"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none flex-1 md:flex-none">
              <option>All Levels</option>
              <option>Level A</option>
              <option>Level B</option>
              <option>Level C</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none flex-1 md:flex-none"
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
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-chrome border-collapse min-w-[800px]">
            <thead className="text-xs uppercase bg-white/5 text-chrome/60 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3 font-medium w-10">
                  <input type="checkbox" className="accent-accent-violet border-white/20 bg-transparent rounded" />
                </th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">BHK</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map(prop => (
                <tr key={prop.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="accent-accent-violet rounded" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-white/10 overflow-hidden bg-black/20">
                        <img src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=100&h=100&sig=${prop.id}`} className="w-full h-full object-cover" alt="" />
                      </div>
                      <span className="font-medium text-white">{prop.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4"><span className="px-2 py-1 bg-white/5 rounded text-xs">{prop.level}</span></td>
                  <td className="px-4 py-4">{prop.type}</td>
                  <td className="px-4 py-4 font-mono text-xs">{prop.bhk}</td>
                  <td className="px-4 py-4 text-white font-medium">{prop.price}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 border rounded-md text-xs font-mono uppercase tracking-widest ${getStatusColor(prop.status)}`}>
                      {prop.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => toggleVisibility(prop)}
                        className="p-1.5 hover:bg-white/10 rounded text-chrome hover:text-white transition-colors cursor-pointer" title="Toggle Visibility"
                      >
                        {prop.status === "Active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleEdit(prop)}
                        className="p-1.5 hover:bg-white/10 rounded text-chrome hover:text-accent-teal transition-colors cursor-pointer" title="Edit"
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
        </div>
        
        {/* Pagination Details */}
        <div className="p-4 border-t border-white/5 flex justify-between items-center text-sm text-chrome/50">
          <span>Showing 1 to {filteredProperties.length} of {properties.length} entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl glass-card bg-[#0F0F1A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-serif text-white">{editingProperty ? 'Edit Property' : 'Add New Property'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-chrome hover:text-white">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Property Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Level</label>
                  <select 
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
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
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                  >
                    <option>Residential</option>
                    <option>Commercial</option>
                    <option>Villa</option>
                    <option>Studio</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">BHK / Config</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 3 BHK"
                    value={formData.bhk}
                    onChange={e => setFormData({ ...formData, bhk: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
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
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-chrome/50 mb-1.5">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-accent-violet transition-colors"
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Sold</option>
                    <option>Rented</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 rounded-lg border border-white/10 text-chrome hover:text-white hover:bg-white/5 transition-all"
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
    </div>
  );
}