import { useState, useEffect } from "react";
import { Download, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "../../lib/supabase";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  interested_in: string;
  property_level: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setLeads(data || []);
    } catch (error: any) {
      toast.error('Failed to load leads: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Status updated');
      fetchLeads();
    } catch (error: any) {
      toast.error('Failed to update status: ' + error.message);
    }
  };

  const handleExportCSV = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to export.");
      return;
    }

    const headers = ["Date", "Name", "Email", "Phone", "Interest", "Property Level", "Message", "Status"];
    
    const csvContent = [
      headers.join(","),
      ...filteredLeads.map(lead => {
        const escapeCSV = (field: string | null | undefined) => `"${(field || '').replace(/"/g, '""')}"`;
        
        return [
          escapeCSV(new Date(lead.created_at).toLocaleDateString()),
          escapeCSV(lead.full_name),
          escapeCSV(lead.email),
          escapeCSV(lead.phone),
          escapeCSV(lead.interested_in),
          escapeCSV(lead.property_level),
          escapeCSV(lead.message),
          escapeCSV(lead.status)
        ].join(",");
      })
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `htr_leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };
  const stats = [
    { label: "Total Leads", val: leads.length.toString(), color: "text-chrome" },
    { label: "New (Unread)", val: leads.filter(l => l.status === "New").length.toString(), color: "text-accent-violet" },
    { label: "Contacted", val: leads.filter(l => l.status === "Contacted").length.toString(), color: "text-accent-teal" },
    { label: "Closed - Won", val: leads.filter(l => l.status === "Closed Won").length.toString(), color: "text-green-400" },
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = (lead.full_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                          (lead.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                          (lead.phone || "").includes(searchTerm);
    const matchesStatus = statusFilter === "All Status" || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full w-full min-h-0 space-y-6 mb-20 md:mb-0">
      <h2 className="text-2xl font-serif text-chrome">Leads & Inquiries</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-primary transition-colors duration-300 p-4 rounded-xl border border-black/5 shadow-sm">
            <h4 className="text-chrome/50 text-xs font-mono uppercase tracking-widest mb-1">{s.label}</h4>
            <div className={`text-2xl font-medium ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-primary transition-colors duration-300 border border-black/5 rounded-2xl flex-1 flex flex-col overflow-hidden min-h-0 shadow-sm min-w-0">
        {/* Top Bar */}
        <div className="p-4 border-b border-black/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 w-full gap-4">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome/50" />
              <input 
                type="text" 
                placeholder="Search by name, email, or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/5 border border-black/10 rounded-lg py-2 pl-9 pr-4 text-chrome text-sm focus:outline-none focus:border-accent-violet transition-colors"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-black/5 border border-black/10 rounded-lg px-3 py-2 text-chrome text-sm focus:outline-none"
            >
              <option>All Status</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Closed Won</option>
              <option>Closed Lost</option>
            </select>
          </div>
          
          <button onClick={handleExportCSV} className="px-4 py-2 border border-black/10 rounded-lg text-chrome hover:bg-black/5 transition-colors text-sm flex items-center gap-2 cursor-pointer">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-x-auto overflow-y-auto custom-scrollbar w-full relative">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-chrome/40 space-y-3 py-10">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p>Loading leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-chrome/40 py-10">
              <p>No leads found matching your criteria.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-chrome border-collapse min-w-[1000px]">
              <thead className="text-xs uppercase bg-black/5 text-chrome/60 sticky top-0 z-10 backdrop-blur-md">
                <tr>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Interest</th>
                  <th className="px-4 py-3 font-medium">Message</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map(lead => {
                  const isNew = lead.status === 'New';
                  return (
                    <tr key={lead.id} className={`border-b border-black/5 hover:bg-black/5 transition-colors ${isNew ? 'bg-accent-violet/5' : ''}`}>
                      <td className="px-4 py-4 whitespace-nowrap text-xs">
                        {new Date(lead.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-4 font-medium text-chrome">{lead.full_name}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <a href={`tel:${lead.phone}`} className="text-accent-teal hover:underline">{lead.phone}</a>
                          <a href={`mailto:${lead.email}`} className="text-xs text-chrome/50 hover:text-chrome">{lead.email}</a>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span>{lead.interested_in}</span>
                          <span className="text-xs text-chrome/50">{lead.property_level}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="max-w-xs truncate" title={lead.message}>
                          {lead.message}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <select 
                          value={lead.status}
                          onChange={(e) => updateStatus(lead.id, e.target.value)}
                          className={`text-xs font-mono uppercase tracking-widest rounded px-2 py-1 outline-none border cursor-pointer ${
                            isNew 
                            ? 'bg-accent-violet/10 text-accent-violet border-accent-violet/20' 
                            : 'bg-blue-400/10 text-blue-400 border-blue-400/20'
                          }`}
                        >
                          <option>New</option>
                          <option>Contacted</option>
                          <option>Closed Won</option>
                          <option>Closed Lost</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button 
                          onClick={() => toast.success(`Opening details for ${lead.full_name}`)}
                          className="text-chrome hover:text-accent-teal text-xs underline cursor-pointer"
                        >
                          View Full
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}