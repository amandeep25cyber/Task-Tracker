import { Card } from "../../components/ui/Card";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const taskTrendData = [
  { date: "May 1", created: 45, completed: 38 },
  { date: "May 5", created: 52, completed: 41 },
  { date: "May 10", created: 61, completed: 55 },
  { date: "May 15", created: 58, completed: 60 },
  { date: "May 20", created: 70, completed: 65 },
  { date: "May 25", created: 65, completed: 68 },
];

const projectStatusData = [
  { name: "Completed", value: 14, color: "#10b981" },
  { name: "In Progress", value: 32, color: "#3b82f6" },
  { name: "Planning", value: 2, color: "#6b7280" },
];

const teamProductivity = [
  { team: "Development", productivity: 92 },
  { team: "Design", productivity: 88 },
  { team: "Marketing", productivity: 85 },
  { team: "QA", productivity: 90 },
];

const Analytics =()=> {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
        <p className="text-gray-600">Comprehensive insights and performance metrics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Task Trends">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={taskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="created" stroke="#3b82f6" strokeWidth={2} name="Created" />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Project Status Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Team Productivity">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamProductivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" stroke="#6b7280" />
              <YAxis type="category" dataKey="team" stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="productivity" fill="#3b82f6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly Overview">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-sm text-blue-900 mb-1">Total Tasks Completed</p>
              <p className="text-3xl font-bold text-blue-900">1,247</p>
              <p className="text-sm text-blue-700 mt-2">+18% from last month</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-900 mb-1">Active Users</p>
              <p className="text-3xl font-bold text-green-900">2,543</p>
              <p className="text-sm text-green-700 mt-2">+12% growth</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-sm text-purple-900 mb-1">Average Response Time</p>
              <p className="text-3xl font-bold text-purple-900">2.4h</p>
              <p className="text-sm text-purple-700 mt-2">-15% improvement</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;