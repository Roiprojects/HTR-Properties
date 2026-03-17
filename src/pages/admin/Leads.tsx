import { Download, Search } from "lucide-react";

export default function AdminLeads() {
  const stats = [
    { label: "Total Leads", val: "348", color: "text-white" },
    { label: "New (Unread)", val: "24", color: "text-accent-violet" },
    { label: "Contacted", val: "156", color: "text-accent-teal" },
    { label: "Closed - Won", val: "42", color: "text-green-400" },
  ];

  return (
    <div className="max-w-7xl mx-auto flex flex-col h-full space-y-6">
      <h2 className="text-2xl font-serif text-white">Leads & Inquiries</h2>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="glass-card bg-[#0F0F1A]/50 p-4 rounded-xl border border-white/5">
            <h4 className="text-chrome/50 text-xs font-mono uppercase tracking-widest mb-1">{s.label}</h4>
            <div className={`text-2xl font-medium ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>

      <div className="glass-card bg-[#0F0F1A]/50 border border-white/5 rounded-2xl flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="p-4 border-b border-white/5 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-1 w-full gap-4">
            <div className="relative flex-1 md:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chrome/50" />
              <input 
                type="text" 
                placeholder="Search by name, email, or phone..." 
                className="w-full bg-black/20 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-white text-sm focus:outline-none focus:border-accent-violet transition-colors"
              />
            </div>
            <select className="bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none">
              <option>All Status</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Closed Won</option>
              <option>Closed Lost</option>
            </select>
          </div>
          
          <button className="px-4 py-2 border border-white/10 rounded-lg text-chrome hover:text-white hover:bg-white/5 transition-colors text-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-chrome border-collapse min-w-[1000px]">
            <thead className="text-xs uppercase bg-white/5 text-chrome/60 sticky top-0 z-10 backdrop-blur-md">
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
              {[1, 2, 3, 4, 5, 6, 7].map(i => {
                const isNew = i < 3;
                return (
                  <tr key={i} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isNew ? 'bg-accent-violet/5' : ''}`}>
                    <td className="px-4 py-4 whitespace-nowrap text-xs">Oct {15-i}, 2025</td>
                    <td className="px-4 py-4 font-medium text-white">Client Name {i}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <a href="tel:9876543210" className="text-accent-teal hover:underline">+91 98765 43210</a>
                        <a href="mailto:client@example.com" className="text-xs text-chrome/50 hover:text-chrome">client{i}@example.com</a>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span>Buy Property</span>
                        <span className="text-xs text-chrome/50">Level A</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="max-w-xs truncate" title="I am interested in viewing the Skyline Penthouse on MG Road. Please call me back soon.">
                        I am interested in viewing the Skyline...
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <select 
                        defaultValue={isNew ? "New" : "Contacted"}
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
                      <button className="text-chrome hover:text-white text-xs underline">
                        View Full
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}