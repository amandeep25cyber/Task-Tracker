import { StatCard, Card } from "../../components/ui/Card";
import { CheckSquare, Clock, CheckCircle2, MessageSquare } from "lucide-react";

const todayTasks = [
  { id: 1, title: "Complete homepage design", priority: "high", status: "in-progress", project: "Website Redesign" },
  { id: 2, title: "Review pull request", priority: "medium", status: "todo", project: "API Integration" },
  { id: 3, title: "Update documentation", priority: "low", status: "todo", project: "Mobile App" },
];

const recentMessages = [
  { from: "Mike Chen", message: "Can you review the latest design?", time: "10 min ago", unread: true },
  { from: "Sarah Johnson", message: "Great work on the landing page!", time: "1 hour ago", unread: true },
  { from: "Emily Davis", message: "Team meeting at 3 PM today", time: "2 hours ago", unread: false },
];

const EmployeeDashboard = ()=> {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Here's what you need to focus on today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Tasks"
          value="8"
          change="3 high priority"
          icon={<CheckSquare className="w-6 h-6" />}
          trend="neutral"
        />
        <StatCard
          title="Pending Work"
          value="12"
          change="Across 3 projects"
          icon={<Clock className="w-6 h-6" />}
          trend="neutral"
        />
        <StatCard
          title="Completed This Week"
          value="24"
          change="+6 from last week"
          icon={<CheckCircle2 className="w-6 h-6" />}
          trend="up"
        />
        <StatCard
          title="Unread Messages"
          value="5"
          change="2 from managers"
          icon={<MessageSquare className="w-6 h-6" />}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Today's Tasks">
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div key={task.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    task.priority === "high" ? "bg-red-100 text-red-700" :
                    task.priority === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{task.project}</p>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">Mark as complete</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            View All Tasks
          </button>
        </Card>

        <Card title="Recent Messages">
          <div className="space-y-3">
            {recentMessages.map((msg, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">{msg.from.substring(0, 2).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{msg.from}</p>
                      <p className="text-sm text-gray-600">{msg.message}</p>
                    </div>
                  </div>
                  {msg.unread && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  )}
                </div>
                <p className="text-xs text-gray-500 ml-13">{msg.time}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
            Open Chat
          </button>
        </Card>
      </div>

      <Card title="Quick Actions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            <CheckSquare className="w-8 h-8 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">View My Tasks</p>
            <p className="text-sm text-gray-600 mt-1">12 pending tasks</p>
          </button>
          <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
            <MessageSquare className="w-8 h-8 text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Team Chat</p>
            <p className="text-sm text-gray-600 mt-1">5 unread messages</p>
          </button>
          <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
            <Clock className="w-8 h-8 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Time Tracking</p>
            <p className="text-sm text-gray-600 mt-1">Log your hours</p>
          </button>
        </div>
      </Card>
    </div>
  );
}

export default EmployeeDashboard