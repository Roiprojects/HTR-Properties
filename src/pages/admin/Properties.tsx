import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

const mockProperties = [
  { id: 1, title: "Skyline Penthouse", level: "Level A", type: "Residential", bhk: "3 BHK", price: "₹4.2 Cr", status: "Active", date: "Oct 12, 2025" },
  { id: 2, title: "Corporate Tower Suite", level: "Level A", type: "Commercial", bhk: "-", price: "₹1.8L/mo", status: "Rented", date: "Oct 10, 2025" },
  { id: 3, title: "Serene Heights Apartment", level: "Level B", type: "Residential", bhk: "2 BHK", price: "₹1.1 Cr", status: "Active", date: "Oct 08, 2025" },
  { id: 4, title: "Green Valley Villa", level: "Level B", type: "Residential", bhk: "4 BHK", price: "₹85k/mo", status: "Inactive", date: "Oct 05, 2025" },
  { id: 5, title: "Compact Studio", level: "Level C", type: "Residential", bhk: "1 BHK", price: "₹45 L", status: "Sold", date: "Sep 28, 2025" },
];

export default function AdminProperties() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
        <Link to="/admin/properties/new" className="px-4 py-2 bg-gradient-to-r from-accent-violet to-accent-teal rounded-lg text-white font-medium text-sm flex items-center gap-2 hover:shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
          <Plus className="w-4 h-4" /> Add New Property
        </Link>
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
              {mockProperties.map(prop => (
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
                      <button className="p-1.5 hover:bg-white/10 rounded text-chrome hover:text-white transition-colors" title="Toggle Visibility">
                        {prop.status === "Active" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button className="p-1.5 hover:bg-white/10 rounded text-chrome hover:text-accent-teal transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-destructive/20 rounded text-chrome hover:text-destructive transition-colors" title="Delete">
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
          <span>Showing 1 to 5 of 24 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}