import { Card } from "../../components/ui/Card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Download, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const dataByPeriod = {
  "This Week": {
    trend: [
      { label: "Mon", completed: 12, created: 15 },
      { label: "Tue", completed: 15, created: 10 },
      { label: "Wed", completed: 18, created: 12 },
      { label: "Thu", completed: 14, created: 16 },
      { label: "Fri", completed: 20, created: 14 },
      { label: "Sat", completed: 8, created: 5 },
      { label: "Sun", completed: 6, created: 4 },
    ],
    performance: [
      { name: "Emily", tasks: 22, onTime: 20 },
      { name: "John", tasks: 18, onTime: 16 },
      { name: "Lisa", tasks: 25, onTime: 24 },
      { name: "David", tasks: 14, onTime: 12 },
    ],
    timeline: [
      { project: "Website Redesign", progress: 65, status: "In Progress", due: "May 15" },
      { project: "API Integration", progress: 40, status: "In Progress", due: "May 22" },
      { project: "Mobile App", progress: 80, status: "In Progress", due: "May 10" },
    ],
    stats: { total: 93, rate: 85, onTime: 79, overdue: 4 },
  },
  "This Month": {
    trend: [
      { label: "May 1", completed: 45, created: 52 },
      { label: "May 5", completed: 55, created: 60 },
      { label: "May 10", completed: 68, created: 65 },
      { label: "May 15", completed: 72, created: 70 },
      { label: "May 20", completed: 80, created: 75 },
      { label: "May 25", completed: 85, created: 88 },
      { label: "May 30", completed: 90, created: 84 },
    ],
    performance: [
      { name: "Emily", tasks: 47, onTime: 43 },
      { name: "John", tasks: 41, onTime: 37 },
      { name: "Lisa", tasks: 49, onTime: 47 },
      { name: "David", tasks: 33, onTime: 29 },
    ],
    timeline: [
      { project: "Website Redesign", progress: 65, status: "In Progress", due: "May 15" },
      { project: "API Integration", progress: 40, status: "In Progress", due: "May 22" },
      { project: "Mobile App", progress: 80, status: "In Progress", due: "May 10" },
      { project: "Dashboard v2", progress: 20, status: "Planning", due: "Jun 1" },
      { project: "CRM Module", progress: 95, status: "Review", due: "May 8" },
    ],
    stats: { total: 247, rate: 88, onTime: 84, overdue: 9 },
  },
  "This Quarter": {
    trend: [
      { label: "Mar W1", completed: 180, created: 195 },
      { label: "Mar W2", completed: 195, created: 200 },
      { label: "Apr W1", completed: 210, created: 215 },
      { label: "Apr W2", completed: 225, created: 220 },
      { label: "May W1", completed: 240, created: 235 },
      { label: "May W2", completed: 255, created: 250 },
    ],
    performance: [
      { name: "Emily", tasks: 142, onTime: 130 },
      { name: "John", tasks: 118, onTime: 105 },
      { name: "Lisa", tasks: 155, onTime: 148 },
      { name: "David", tasks: 98, onTime: 88 },
    ],
    timeline: [
      { project: "Website Redesign", progress: 65, status: "In Progress", due: "May 15" },
      { project: "API Integration", progress: 40, status: "In Progress", due: "May 22" },
      { project: "Mobile App", progress: 80, status: "In Progress", due: "May 10" },
      { project: "Dashboard v2", progress: 20, status: "Planning", due: "Jun 1" },
      { project: "CRM Module", progress: 95, status: "Review", due: "May 8" },
      { project: "Analytics Engine", progress: 100, status: "Completed", due: "Apr 30" },
      { project: "Auth Overhaul", progress: 100, status: "Completed", due: "Mar 28" },
    ],
    stats: { total: 728, rate: 91, onTime: 87, overdue: 18 },
  },
};

const statusColors = {
  "In Progress": "bg-blue-100 text-blue-700",
  Planning: "bg-amber-100 text-amber-700",
  Review: "bg-violet-100 text-violet-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

const Reports = ()=> {
  const [period, setPeriod] = useState("This Month");
  const [toast, setToast] = useState(false);
  const d = dataByPeriod[period];

  const exportCSV = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium">Report exported to report.csv</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1><p className="text-gray-600">Team performance and project insights</p></div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-xl p-1">
            {(["This Week", "This Month", "This Quarter"]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${period === p ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>{p}</button>
            ))}
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm font-medium">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Tasks Completed", value: d.stats.total },
          { label: "Completion Rate", value: `${d.stats.rate}%` },
          { label: "On-time Rate", value: `${d.stats.onTime}%` },
          { label: "Overdue", value: d.stats.overdue },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title={`Task Trend — ${period}`}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={d.trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} dot={false} name="Completed" />
              <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2.5} dot={false} name="Created" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Member Performance">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={d.performance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px" }} />
              <Legend iconType="square" iconSize={8} wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Total Tasks" />
              <Bar dataKey="onTime" fill="#10b981" radius={[6, 6, 0, 0]} name="On Time" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Project Timeline" className="lg:col-span-2">
          <div className="space-y-4">
            {d.timeline.map((proj) => (
              <div key={proj.project}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{proj.project}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[proj.status] || "bg-gray-100 text-gray-600"}`}>{proj.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>Due {proj.due}</span>
                    <span className="font-bold text-gray-900">{proj.progress}%</span>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${proj.progress === 100 ? "bg-emerald-500" : proj.status === "Planning" ? "bg-amber-400" : "bg-blue-500"}`}
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Reports