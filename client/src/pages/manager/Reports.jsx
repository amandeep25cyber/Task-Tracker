import { Card } from "../../components/ui/Card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download, Calendar } from "lucide-react";

const weeklyData = [
  { day: "Mon", completed: 12, created: 15 },
  { day: "Tue", completed: 15, created: 10 },
  { day: "Wed", completed: 18, created: 12 },
  { day: "Thu", completed: 14, created: 16 },
  { day: "Fri", completed: 20, created: 14 },
  { day: "Sat", completed: 8, created: 5 },
  { day: "Sun", completed: 6, created: 4 },
];

const memberPerformance = [
  { name: "Emily", tasks: 47 },
  { name: "John", tasks: 41 },
  { name: "Lisa", tasks: 49 },
  { name: "David", tasks: 33 },
];

const Reports = ()=> {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Team performance and project insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
          </select>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-2">Tasks Completed</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">93</p>
            <p className="text-sm text-green-600">+18% from last week</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-2">Average Completion Time</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">2.4 days</p>
            <p className="text-sm text-green-600">-12% improvement</p>
          </div>
        </Card>
        <Card>
          <div className="p-6">
            <p className="text-sm text-gray-600 mb-2">Team Productivity</p>
            <p className="text-3xl font-bold text-gray-900 mb-2">92%</p>
            <p className="text-sm text-blue-600">Above target</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Weekly Task Activity">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
              <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} name="Created" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Team Member Performance">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={memberPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Project Timeline">
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Website Redesign</h4>
                <p className="text-sm text-gray-600 mb-3">Started May 1 • Due May 30</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Mobile App Launch</h4>
                <p className="text-sm text-gray-600 mb-3">Started May 10 • Due Jun 15</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: "40%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Reports