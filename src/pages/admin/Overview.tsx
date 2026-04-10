import { useState, useEffect } from "react";
import { FileText, TrendingUp, Eye, Building2, Bell, Inbox, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [propsRes, leadsRes] = await Promise.all([
        supabase.from('properties').select('*').order('created_at', { ascending: false }),
        supabase.from('leads').select('*').order('created_at', { ascending: false })
      ]);

      if (propsRes.error) throw propsRes.error;
      if (leadsRes.error) throw leadsRes.error;

      setProperties(propsRes.data || []);
      setLeads(leadsRes.data || []);
    } catch (error: any) {
      console.error("Error fetching overview data:", error);
      toast.error("Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  // 1. KPIs Calculations
  const activeListings = properties.filter(p => p.status === 'Active').length;
  const soldRented = properties.filter(p => p.status === 'Sold' || p.status === 'Rented').length;
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const totalProperties = properties.length;

  const kpis = [
    { icon: Building2, label: "Active Listings", val: activeListings.toString(), sub: `Out of ${totalProperties} total`, color: "text-accent-violet" },
    { icon: Bell, label: "New Inquiries", val: newLeads.toString(), sub: "Needs triage", color: "text-accent-teal" },
    { icon: Eye, label: "Total Properties", val: totalProperties.toString(), sub: "All time", color: "text-blue-400" },
    { icon: TrendingUp, label: "Sold/Rented", val: soldRented.toString(), sub: "Total closed", color: "text-green-400" },
    { icon: FileText, label: "Total Leads", val: totalLeads.toString(), sub: "All time pipeline", color: "text-yellow-400" },
  ];

  // 2. Recent Inquiries (Top 4 leads)
  const recentLeads = leads.slice(0, 4);

  const getLeadStatusColor = (status: string) => {
    switch (status) {
      case "New": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Contacted": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "Closed Won": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Closed Lost": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-chrome bg-chrome/10 border-chrome/20";
    }
  };

  // 3. Properties by Level (Pie Chart)
  const levelCounts: Record<string, number> = {};
  properties.forEach(p => {
    const lvl = p.level || 'Unknown';
    levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
  });

  const levelColors: Record<string, string> = {
    'Level A': '#7C3AED',
    'Level B': '#4F46E5',
    'Level C': '#2DD4BF'
  };

  const defaultColor = '#94A3B8';
  
  const pieData = Object.keys(levelCounts).map((key) => ({
    name: key,
    value: levelCounts[key],
    color: levelColors[key] || defaultColor
  })).filter(item => item.value > 0);

  if (pieData.length === 0) {
    // Fallback so chart doesn't break if no data
    pieData.push({ name: 'No Data', value: 1, color: '#333' });
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-accent-violet animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* 1. KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="bg-primary transition-colors duration-300 p-5 rounded-xl border border-black/5 relative overflow-hidden group shadow-sm">
            <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-20 ${kpi.color.replace('text-', 'bg-')}`}></div>
            <div className="flex items-center gap-3 mb-2 opacity-70">
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              <h3 className="text-sm font-medium">{kpi.label}</h3>
            </div>
            <div className="text-3xl font-mono text-chrome mb-1">{kpi.val}</div>
            <p className="text-xs text-chrome/40">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* 2. Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/admin/leads" className="px-6 py-3 rounded-lg bg-black/5 border border-black/10 text-chrome text-sm font-medium hover:bg-black/10 transition-colors flex items-center gap-2">
          <Inbox className="w-4 h-4" /> View All Leads
        </Link>
      </div>

      {/* 3. Detailed Data Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 bg-primary transition-colors duration-300 border border-black/5 rounded-2xl overflow-hidden flex flex-col shadow-sm">
          <div className="p-5 border-b border-black/5 flex justify-between items-center">
            <h3 className="text-chrome font-medium">Recent Inquiries</h3>
            <Link to="/admin/leads" className="text-xs font-mono uppercase tracking-widest text-accent-teal hover:text-white transition-colors">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto flex-1 p-1 custom-scrollbar">
            {recentLeads.length === 0 ? (
              <div className="p-6 text-center text-chrome/50 text-sm">No recent inquiries found.</div>
            ) : (
            <table className="w-full text-left text-sm text-chrome/70">
              <thead className="text-xs uppercase bg-black/5 text-chrome/50">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Name</th>
                  <th className="px-4 py-3 font-medium">Interest</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((row, i) => (
                  <tr key={i} className="border-b border-black/5 hover:bg-black/5 transition-colors">
                    <td className="px-4 py-4 font-medium text-chrome">{row.full_name}</td>
                    <td className="px-4 py-4">{row.interested_in} - {row.property_level}</td>
                    <td className="px-4 py-4">
                       {new Date(row.created_at).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 border rounded text-xs font-mono uppercase ${getLeadStatusColor(row.status)}`}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-primary transition-colors duration-300 border border-black/5 rounded-2xl p-5 flex flex-col shadow-sm">
          <h3 className="text-chrome font-medium mb-6">Properties by Level</h3>
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
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#00000010', color: '#18181b' }}
                  itemStyle={{ color: '#18181b' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
              <span className="text-3xl font-mono text-chrome">{totalProperties}</span>
              <span className="text-xs text-chrome/50">Total</span>
            </div>
          </div>
          <div className="flex justify-center flex-wrap gap-4 mt-2">
            {pieData.map(entry => (
              entry.name !== 'No Data' && (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-chrome/70">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}