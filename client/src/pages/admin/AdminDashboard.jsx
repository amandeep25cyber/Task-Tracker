import { Card, StatCard } from "../../components/ui/Card"
import { Users, FolderKanban, CheckCircle2, Activity, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react";
import { getdashboardStats, getTeamPerformance } from "../../services/organisation.services";
import { setTeamPerformance, storeDashboardStats } from "../../store/features/orgSlice";


const recentActivity = [
  { user: "Sarah Johnson", action: "created project", target: "Website Redesign", time: "2 hours ago" },
  { user: "Mike Chen", action: "completed task", target: "API Integration", time: "3 hours ago" },
  { user: "Emily Davis", action: "joined team", target: "Development Team", time: "5 hours ago" },
  { user: "John Smith", action: "updated project", target: "Mobile App Launch", time: "1 day ago" },
  { user: "Lisa Wong", action: "assigned task", target: "Bug Fix #234", time: "1 day ago" },
];

const AdminDashboard = ()=> {

  const performanceData = useSelector(state=>state.organisation.teamPerformance);
  const statsData = useSelector(state=>state.organisation.dashboardStats);
  const dispatch = useDispatch();

  useEffect(()=>{
    getDashboardData();
  },[])

  const getDashboardData = async()=>{
    try {
      const res = await getTeamPerformance();
      const resStats = await getdashboardStats();
      dispatch(setTeamPerformance(res?.data));
      dispatch(storeDashboardStats(resStats?.data));
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your system overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={statsData ? statsData?.totalUsers : "0"}
          change="+12% from last month"
          icon={<Users className="w-6 h-6" />}
          trend="up"
        />
        <StatCard
          title="Active Projects"
          value={statsData ? statsData?.activeProjects : "0"}
          change="+5 new this week"
          icon={<FolderKanban className="w-6 h-6" />}
          trend="up"
        />
        <StatCard
          title="Completed Tasks"
          value={statsData ? statsData?.completedTasks : "0"}
          change="+8% completion rate"
          icon={<CheckCircle2 className="w-6 h-6" />}
          trend="up"
        />
        <StatCard
          title="Pending Tasks"
          value={statsData ? statsData?.pendingTasks : "0"}
          change="-2% completion rate"
          icon={<Activity className="w-6 h-6" />}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Team Performance">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Area id="area-tasks" type="monotone" dataKey="tasks" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Area id="area-users" type="monotone" dataKey="users" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Project Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card title="Recent Activity">
        <div className="space-y-4">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-sm font-medium">{activity.user.substring(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                  <span className="font-medium">{activity.target}</span>
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

export default AdminDashboard;
