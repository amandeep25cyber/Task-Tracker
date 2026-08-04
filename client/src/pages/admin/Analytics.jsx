import { Card } from "../../components/ui/Card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, TrendingUp, TrendingDown, Minus, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const dataByPeriod = {
  "This Week": {
    taskTrend: [
      { date: "Mon", created: 18, completed: 14 },
      { date: "Tue", created: 22, completed: 20 },
      { date: "Wed", created: 15, completed: 18 },
      { date: "Thu", created: 25, completed: 22 },
      { date: "Fri", created: 20, completed: 19 },
      { date: "Sat", created: 8, completed: 6 },
      { date: "Sun", created: 5, completed: 4 },
    ],
    stats: { tasks: 103, users: 412, avgTime: "1.8h", taskChange: "+5%", userChange: "+2%", timeChange: "-8%" },
  },
  "This Month": {
    taskTrend: [
      { date: "May 1", created: 45, completed: 38 },
      { date: "May 5", created: 52, completed: 41 },
      { date: "May 10", created: 61, completed: 55 },
      { date: "May 15", created: 58, completed: 60 },
      { date: "May 20", created: 70, completed: 65 },
      { date: "May 25", created: 65, completed: 68 },
      { date: "May 30", created: 72, completed: 70 },
    ],
    stats: { tasks: 1247, users: 2543, avgTime: "2.4h", taskChange: "+18%", userChange: "+12%", timeChange: "-15%" },
  },
  "This Quarter": {
    taskTrend: [
      { date: "Mar W1", created: 180, completed: 162 },
      { date: "Mar W2", created: 195, completed: 180 },
      { date: "Apr W1", created: 210, completed: 200 },
      { date: "Apr W2", created: 225, completed: 215 },
      { date: "May W1", created: 240, completed: 228 },
      { date: "May W2", created: 255, completed: 247 },
    ],
    stats: { tasks: 3420, users: 2543, avgTime: "2.1h", taskChange: "+32%", userChange: "+28%", timeChange: "-22%" },
  },
};

const projectStatusData = [
  { name: "Completed", value: 14, color: "#10b981" },
  { name: "In Progress", value: 32, color: "#3b82f6" },
  { name: "Planning", value: 8, color: "#f59e0b" },
  { name: "On Hold", value: 2, color: "#6b7280" },
];

const teamProductivity = [
  { team: "Development", productivity: 92, target: 85 },
  { team: "Design", productivity: 88, target: 85 },
  { team: "Marketing", productivity: 85, target: 80 },
  { team: "QA", productivity: 90, target: 85 },
];

function TrendIcon({ change }) {
  if (change.startsWith("+")) return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (change.startsWith("-")) return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

const Analytics = () => {
  const [period, setPeriod] = useState("This Month");
  const [toast, setToast] = useState(false);
  const data = dataByPeriod[period];

  const exportReport = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium">Report exported to analytics-report.csv</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h1><p className="text-gray-600">Comprehensive insights and performance metrics</p></div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(["This Week", "This Month", "This Quarter"]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>{p}</button>
            ))}
          </div>
          <button onClick={exportReport} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm font-medium">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: "Tasks Completed", value: data.stats.tasks.toLocaleString(), change: data.stats.taskChange, sub: "vs previous period", color: "bg-blue-50 border-blue-100" },
          { label: "Active Users", value: data.stats.users.toLocaleString(), change: data.stats.userChange, sub: "growth", color: "bg-emerald-50 border-emerald-100" },
          { label: "Avg Response Time", value: data.stats.avgTime, change: data.stats.timeChange, sub: "improvement", color: "bg-violet-50 border-violet-100" },
        ].map((kpi) => (
          <div key={kpi.label} className={`p-5 rounded-xl border ${kpi.color}`}>
            <p className="text-sm font-medium text-gray-600 mb-2">{kpi.label}</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</p>
            <div className="flex items-center gap-1.5">
              <TrendIcon change={kpi.change} />
              <span className={`text-sm font-semibold ${kpi.change.startsWith("+") ? "text-emerald-600" : kpi.change.startsWith("-") ? "text-red-600" : "text-gray-500"}`}>{kpi.change}</span>
              <span className="text-xs text-gray-400">{kpi.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Trends */}
        <Card title={`Task Trends — ${period}`}>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.taskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Created" />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} dot={false} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Project Status */}
        <Card title="Project Status Distribution">
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="60%" height={280}>
              <PieChart>
                <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value">
                  {projectStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {projectStatusData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-sm text-gray-700">{d.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{d.value}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-600">Total</span>
                <span className="text-sm font-bold text-gray-900">{projectStatusData.reduce((a, d) => a + d.value, 0)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Team Productivity */}
        <Card title="Team Productivity">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={teamProductivity} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" tick={{ fontSize: 11 }} unit="%" />
              <YAxis type="category" dataKey="team" stroke="#9ca3af" tick={{ fontSize: 12 }} width={85} />
              <Tooltip formatter={(v) => [`${v}%`]} contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
              <Bar dataKey="productivity" fill="#3b82f6" radius={[0, 6, 6, 0]} name="Productivity" />
              <Bar dataKey="target" fill="#e5e7eb" radius={[0, 6, 6, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Summary */}
        <Card title="Performance Breakdown">
          <div className="p-2 space-y-4">
            {[
              { label: "Task Completion Rate", value: 89, color: "bg-blue-500" },
              { label: "On-time Delivery", value: 76, color: "bg-emerald-500" },
              { label: "Bug Resolution Rate", value: 94, color: "bg-violet-500" },
              { label: "Team Satisfaction", value: 88, color: "bg-amber-500" },
              { label: "Customer Satisfaction", value: 92, color: "bg-teal-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-700 font-medium">{item.label}</span>
                  <span className="font-bold text-gray-900">{item.value}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;