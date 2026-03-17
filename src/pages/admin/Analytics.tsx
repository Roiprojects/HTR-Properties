import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { Filter } from "lucide-react";

// Mock Data
const inquiriesData = [
  { date: 'Oct 01', inquiries: 5 }, { date: 'Oct 05', inquiries: 8 }, 
  { date: 'Oct 10', inquiries: 15 }, { date: 'Oct 15', inquiries: 12 }, 
  { date: 'Oct 20', inquiries: 25 }, { date: 'Oct 25', inquiries: 18 }
];

const newPropsData = [
  { month: 'Jun', Level_A: 2, Level_B: 4, Level_C: 5 },
  { month: 'Jul', Level_A: 3, Level_B: 2, Level_C: 4 },
  { month: 'Aug', Level_A: 1, Level_B: 5, Level_C: 2 },
  { month: 'Sep', Level_A: 4, Level_B: 3, Level_C: 5 },
  { month: 'Oct', Level_A: 2, Level_B: 6, Level_C: 3 },
];

const typeData = [ { name: 'Residential', value: 75, color: '#7C3AED' }, { name: 'Commercial', value: 25, color: '#2DD4BF' } ];
const statusData = [ { name: 'Active', value: 50, color: '#4ADE80' }, { name: 'Sold', value: 20, color: '#F87171' }, { name: 'Rented', value: 15, color: '#2DD4BF' }, { name: 'Inactive', value: 15, color: '#94A3B8' } ];
const interestData = [ { name: 'Buy', value: 60, color: '#7C3AED' }, { name: 'Rent', value: 30, color: '#4F46E5' }, { name: 'Sell', value: 10, color: '#2DD4BF' } ];

const viewedProps = [
  { name: 'Skyline Penthouse', views: 4500 }, { name: 'Corporate Tower', views: 3200 }, 
  { name: 'Serene Heights', views: 2800 }, { name: 'Compact Studio', views: 2100 }, 
  { name: 'Green Valley Villa', views: 1900 },
];

const pipelineData = [
  { stage: 'Inquiries', count: 348 }, { stage: 'Contacted', count: 156 }, { stage: 'Closed Won', count: 42 }
];

const priceTrendData = [
  { month: 'May', price: 1.2 }, { month: 'Jun', price: 1.4 }, { month: 'Jul', price: 1.35 },
  { month: 'Aug', price: 1.6 }, { month: 'Sep', price: 1.8 }, { month: 'Oct', price: 1.95 }
];

export default function AdminAnalytics() {
  const chartProps = {
    margin: { top: 10, right: 10, left: -20, bottom: 0 },
  };

  const AxisProps = {
    tick: { fill: '#94A3B8', fontSize: 12 }, axisLine: { stroke: '#334155' }, tickLine: { stroke: '#334155' }
  };

  const tooltipProps = {
    contentStyle: { backgroundColor: '#0F0F1A', borderColor: 'rgba(124,58,237,0.3)', color: '#fff', borderRadius: '8px' },
    itemStyle: { color: '#fff' }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-serif text-white">Analytics Overview</h2>
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-chrome/50" />
          <select className="bg-[#0F0F1A]/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-accent-violet transition-colors">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
            <option>All Time</option>
          </select>
        </div>
      </div>

      {/* ROW 1: Line & Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card bg-[#0F0F1A]/50 rounded-2xl p-6 border border-white/5 h-80 flex flex-col">
          <h3 className="text-white font-medium mb-1">Inquiries Trend</h3>
          <p className="text-chrome/50 text-xs mb-6">Daily inquiries over the selected period</p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={inquiriesData} {...chartProps}>
              <defs>
                <linearGradient id="colorInq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" {...AxisProps} />
              <YAxis {...AxisProps} />
              <RechartsTooltip {...tooltipProps} />
              <Area type="monotone" dataKey="inquiries" stroke="#2DD4BF" strokeWidth={2} fillOpacity={1} fill="url(#colorInq)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card bg-[#0F0F1A]/50 rounded-2xl p-6 border border-white/5 h-80 flex flex-col">
          <h3 className="text-white font-medium mb-1">New Properties Added</h3>
          <p className="text-chrome/50 text-xs mb-6">Stacked by Level A/B/C over time</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={newPropsData} {...chartProps}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" {...AxisProps} />
              <YAxis {...AxisProps} />
              <RechartsTooltip {...tooltipProps} />
              <Bar dataKey="Level_C" stackId="a" fill="#2DD4BF" radius={[0, 0, 4, 4]} />
              <Bar dataKey="Level_B" stackId="a" fill="#4F46E5" />
              <Bar dataKey="Level_A" stackId="a" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            <span className="text-xs text-chrome/70 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#7C3AED]"></div>Level A</span>
            <span className="text-xs text-chrome/70 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#4F46E5]"></div>Level B</span>
            <span className="text-xs text-chrome/70 flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#2DD4BF]"></div>Level C</span>
          </div>
        </div>
      </div>

      {/* ROW 2: 3 Donuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card bg-[#0F0F1A]/50 rounded-2xl p-6 border border-white/5 h-64 flex flex-col items-center">
          <h3 className="text-white font-medium mb-1 w-full">By Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={typeData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                {typeData.map((e, index) => <Cell key={`cell-${index}`} fill={e.color} />)}
              </Pie>
              <RechartsTooltip {...tooltipProps} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card bg-[#0F0F1A]/50 rounded-2xl p-6 border border-white/5 h-64 flex flex-col items-center">
          <h3 className="text-white font-medium mb-1 w-full">By Status</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                {statusData.map((e, index) => <Cell key={`cell-${index}`} fill={e.color} />)}
              </Pie>
              <RechartsTooltip {...tooltipProps} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card bg-[#0F0F1A]/50 rounded-2xl p-6 border border-white/5 h-64 flex flex-col items-center">
          <h3 className="text-white font-medium mb-1 w-full">Lead Interests</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={interestData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                {interestData.map((e, index) => <Cell key={`cell-${index}`} fill={e.color} />)}
              </Pie>
              <RechartsTooltip {...tooltipProps} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW 3: Horizontal Bar & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card bg-[#0F0F1A]/50 rounded-2xl p-6 border border-white/5 h-80 flex flex-col">
          <h3 className="text-white font-medium mb-1">Most Viewed Properties</h3>
          <p className="text-chrome/50 text-xs mb-6">Top 5 by page views</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={viewedProps} margin={{ top: 0, right: 10, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
              <XAxis type="number" {...AxisProps} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={120} />
              <RechartsTooltip {...tooltipProps} />
              <Bar dataKey="views" fill="#7C3AED" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card bg-[#0F0F1A]/50 rounded-2xl p-6 border border-white/5 h-80 flex flex-col">
          <h3 className="text-white font-medium mb-1">Lead Pipeline</h3>
          <p className="text-chrome/50 text-xs mb-6">Conversion metrics</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipelineData} {...chartProps} barSize={60}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="stage" {...AxisProps} />
              <YAxis {...AxisProps} />
              <RechartsTooltip {...tooltipProps} />
              <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW 4: Full Area Chart */}
      <div className="glass-card bg-[#0F0F1A]/50 rounded-2xl p-6 border border-white/5 h-96 flex flex-col">
          <h3 className="text-white font-medium mb-1">Portfolio Value Trend</h3>
          <p className="text-chrome/50 text-xs mb-6">Average property price trend (in ₹ Crores)</p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceTrendData} {...chartProps}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="month" {...AxisProps} />
              <YAxis {...AxisProps} tickFormatter={(v) => `₹${v}Cr`} />
              <RechartsTooltip 
                {...tooltipProps} 
                formatter={(value: any) => [`₹${value} Cr`, "Average Price"]} 
              />
              <Area type="monotone" dataKey="price" stroke="#7C3AED" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
    </div>
  );
}