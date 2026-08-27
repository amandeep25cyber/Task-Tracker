import { StatCard, Card } from "../../components/ui/Card";
import { FolderKanban, Clock, CheckCircle2, Users, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getDashboardStats } from "../../services/manager.services.js";

const activeProjects = [
  { id: 1, name: "Website Redesign", progress: 65, tasks: 16, deadline: "May 30" },
  { id: 2, name: "Mobile App Launch", progress: 40, tasks: 37, deadline: "Jun 15" },
  { id: 3, name: "API Integration", progress: 100, tasks: 0, deadline: "May 20" },
];

const upcomingDeadlines = [
  { task: "Complete homepage design", project: "Website Redesign", date: "May 25", priority: "high" },
  { task: "Review API documentation", project: "API Integration", date: "May 26", priority: "medium" },
  { task: "Deploy to staging", project: "Mobile App Launch", date: "May 28", priority: "high" },
];

const teamActivity = [
  { member: "Emily Davis", task: "Updated landing page design", time: "2 hours ago" },
  { member: "John Smith", task: "Completed user authentication", time: "4 hours ago" },
  { member: "Lisa Wong", task: "Fixed navigation bug", time: "5 hours ago" },
];

const ManagerDashboard = ()=> {

  const [stats, setStats] = useState({});

  useEffect(()=>{
    getStatsData();
  },[]);

  const getStatsData = async()=>{
    try {
      const result = await getDashboardStats();
      console.log(result);
    

    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Project Manager Dashboard</h1>
        <p className="text-gray-600">Manage your projects and team performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Projects"
          value="8"
          change="+2 this month"
          icon={<FolderKanban className="w-6 h-6" />}
          trend="up"
        />
        <StatCard
          title="Pending Tasks"
          value="53"
          change="Across all projects"
          icon={<Clock className="w-6 h-6" />}
          trend="neutral"
        />
        <StatCard
          title="Completed This Week"
          value="47"
          change="+12% vs last week"
          icon={<CheckCircle2 className="w-6 h-6" />}
          trend="up"
        />
        <StatCard
          title="Team Members"
          value="12"
          change="3 active now"
          icon={<Users className="w-6 h-6" />}
          trend="neutral"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Active Projects">
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div key={project.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <Link to={`/manager/project/${project.id}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <span className="text-sm text-gray-600">{project.tasks} tasks</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    Due {project.deadline}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Upcoming Deadlines">
          <div className="space-y-3">
            {upcomingDeadlines.map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">{item.task}</h4>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    item.priority === "high" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{item.project}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  {item.date}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Recent Team Activity">
        <div className="space-y-4">
          {teamActivity.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-medium">{activity.member.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.member}</span> {activity.task}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default ManagerDashboard;