import { FileText, TrendingUp, Eye, Building2, Bell, Plus, Upload, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const pieData = [
  { name: 'Level A', value: 30, color: '#7C3AED' },
  { name: 'Level B', value: 45, color: '#4F46E5' },
  { name: 'Level C', value: 25, color: '#2DD4BF' },
];

export default function Overview() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* 1. KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { icon: Building2, label: "Active Listings", val: "124", sub: "+12 this month", color: "text-accent-violet" },
          { icon: Bell, label: "New Inquiries", val: "48", sub: "+5 since yesterday", color: "text-accent-teal" },
          { icon: Eye, label: "Total Views", val: "12.5k", sub: "Last 30 days", color: "text-blue-400" },
          { icon: TrendingUp, label: "Sold/Rented", val: "15", sub: "This month", color: "text-green-400" },
          { icon: FileText, label: "Pending (New)", val: "8", sub: "Needs triage", color: "text-yellow-400" },
        ].map((kpi, i) => (
          <div key={i} className="glass-card bg-[#0F0F1A]/80 p-5 rounded-xl border border-white/5 relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-20 ${kpi.color.replace('text-', 'bg-')}`}></div>
            <div className="flex items-center gap-3 mb-2 opacity-70">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              <h3 className="text-sm font-medium">{kpi.label}</h3>
            </div>
            <div className="text-3xl font-mono text-white mb-1">{kpi.val}</div>
            <p className="text-xs text-chrome/40">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 2. Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/admin/properties/new" className="px-6 py-3 rounded-lg bg-accent-violet text-white text-sm font-medium hover:bg-accent-violet/90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Property
        </Link>
        <Link to="/admin/gallery" className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-chrome text-sm font-medium hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload to Gallery
        </Link>
        <Link to="/admin/leads" className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-chrome text-sm font-medium hover:bg-white/10 hover:text-white transition-colors flex items-center gap-2">
          <Inbox className="w-4 h-4" /> View All Leads
        </Link>
      </div>

      {/* 3. Detailed Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 glass-card bg-[#0F0F1A]/50 border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-white font-medium">Recent Inquiries</h3>
            <Link to="/admin/leads" className="text-xs font-mono uppercase tracking-widest text-accent-teal hover:text-white transition-colors">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto flex-1 p-1 custom-scrollbar">
            <table className="w-full text-left text-sm text-chrome/70">
              <thead className="text-xs uppercase bg-white/5 text-chrome/50">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Name</th>
                  <th className="px-4 py-3 font-medium">Interest</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Rahul Sharma", interest: "Buy - Level A", date: "Today, 10:45 AM", status: "New", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
                  { name: "Priya Patel", interest: "Rent - Level B", date: "Yesterday", status: "Contacted", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
                  { name: "Amit Kumar", interest: "Sell Property", date: "Oct 12, 2025", status: "New", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
                  { name: "Neha Singh", interest: "Buy - Level C", date: "Oct 10, 2025", status: "Closed", color: "text-green-400 bg-green-400/10 border-green-400/20" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4 font-medium text-white">{row.name}</td>
                    <td className="px-4 py-4">{row.interest}</td>
                    <td className="px-4 py-4">{row.date}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 border rounded text-xs font-mono uppercase ${row.color}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart */}
        <div className="glass-card bg-[#0F0F1A]/50 border border-white/5 rounded-2xl p-5 flex flex-col">
          <h3 className="text-white font-medium mb-6">Properties by Level</h3>
          <div className="flex-1 min-h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F0F1A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-mono text-white">100</span>
              <span className="text-xs text-chrome/50">Total</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map(entry => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-chrome/70">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}