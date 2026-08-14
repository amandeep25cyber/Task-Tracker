import { StatCard, Card } from "../../components/ui/Card";
import { CheckSquare, Clock, CheckCircle2, MessageSquare, ClockAlert, Plus, Calendar, FolderOpen, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"
import { getDashboardStats, getTodaysTasks, updateLogtimeAndStatus } from "../../services/member.services.js";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { storeDashboardStats } from "../../store/features/memberSlice.js";

const PRIORITY_BADGE = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-gray-100 text-gray-600",
};

/* const [tasks, setTasks] = useState([
    { id: 1, title: "Complete homepage design", priority: "high", status: "in-progress", project: "Website Redesign", done: false },
    { id: 2, title: "Review pull request #42", priority: "medium", status: "todo", project: "API Integration", done: false },
    { id: 3, title: "Update API documentation", priority: "low", status: "todo", project: "Mobile App", done: false },
    { id: 4, title: "Fix login page bug", priority: "high", status: "todo", project: "Auth Module", done: false },
  ]); */

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const statsData = useSelector(state=>state.member.dashboardStats);
  const [completingTaskId, setCompletingTaskId] = useState(null); 
  const [hoursWorked, setHoursWorked] = useState("");

  const [tasks, setTasks] = useState([]);

  useEffect(()=>{
    getDashboardStatsData();
    getTodaysTasksData();
  },[]);

  const getDashboardStatsData = async()=>{
    try {
      const stats = await getDashboardStats();
      dispatch(storeDashboardStats(stats?.data));
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  const getTodaysTasksData = async()=>{
    try {
      const todaysTasks = await getTodaysTasks();
      console.log(todaysTasks?.data);
      setTasks(todaysTasks?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  const handleFinalSubmit = async (taskId) => {
    if(!hoursWorked || hoursWorked <= 0) return toast.warning("Enter valid hours that you have given to this task")

    try {
      const updateTask = await updateLogtimeAndStatus({hours:hoursWorked,status:"done",taskId:completingTaskId});
      getDashboardStatsData();
      getTodaysTasksData();
      setHoursWorked("");
      setCompletingTaskId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
    
  };

  const recentMessages = [
    { from: "Mike Chen", message: "Can you review the latest design?", time: "10 min ago", unread: true },
    { from: "Sarah Johnson", message: "Great work on the landing page!", time: "1 hour ago", unread: true },
    { from: "Emily Davis", message: "Team meeting at 3 PM today", time: "2 hours ago", unread: false },
  ];

  const toggleDone = (id) => {
    setCompletingTaskId(id);
  };

  const completed = tasks.filter((t) => t.done).length;
  const active = tasks.filter((t) => !t.done).length;
  const high = tasks.filter((t) => t.priority === "high" && !t.done).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Here's what you need to focus on today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard title="Active Tasks" value={statsData?.activeTasks || "0"} change={`${statsData?.inProgressTasks || "No"} Tasks In Progress`} icon={<CheckSquare className="w-6 h-6" />} trend={statsData?.inProgressTasks > 0 ? "up" : "neutral"} />
        <StatCard title="Completed This Month" value={statsData?.completedThisMonth || 0} change={`+${statsData?.completedThisWeek || 0} this week`} icon={<CheckCircle2 className="w-6 h-6" />} trend={statsData?.completedThisWeek > 0 ? "up" : "neutral"} />
        <StatCard title="Hours Logged This Month" value={`${statsData?.hoursLoggedThisMonth || 0} ${statsData?.hoursLoggedThisMonth === 1? "Hour" : "Hours"}`} change={ statsData?.hoursLoggedThisWeek > 0 ? `+${statsData?.hoursLoggedThisWeek}h this week` : "0 hours this Week!"} icon={<Clock className="w-6 h-6" />} trend={ statsData?.hoursLoggedThisWeek > 0 ? "up" : "neutral"} />
        <StatCard title="Urgent Tasks" value={statsData?.urgentTasks || 0} change={`Overdue Tasks: ${statsData?.overdueTasks || 0}`} icon={<ClockAlert className="w-6 h-6 text-red-600" />} trend={statsData?.overdueTasks > 0 ? "down" : "neutral"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Today's Tasks">
          <div className="space-y-2 mb-4">
            {tasks.map((task) => (
              <div key={task._id} className="flex-row">
                <div className={`flex items-center gap-3 p-3 rounded-xl border transition-colors bg-white border-gray-200 hover:border-blue-200`}>
                  <button
                    onClick={() => toggleDone(task._id)}
                    type="button"
                    className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors border-gray-300 hover:border-blue-400 select-none`}
                  >
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate text-gray-900`}>{task.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{task.project?.title}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${PRIORITY_BADGE[task.priority]}`}>{task.priority}</span>
                </div>
                {completingTaskId === task._id && (
                  <div className="mt-2 flex gap-2 animate-fade-in-down">
                    <input 
                      type="number" 
                      placeholder="Hours spent?" 
                      value={hoursWorked}
                      max={12}
                      min={0}
                      onChange={(e) => setHoursWorked(e.target.value)}
                      className="shadow-md border border-gray-200 p-2 pl-5 outline-0 rounded-full text-sm w-full"
                    />
                    <button 
                      onClick={() => handleFinalSubmit(task._id)}
                      className="bg-blue-500 shadow-md text-white px-5 rounded-full text-sm"
                    >
                      Done
                    </button>
                    <button 
                      onClick={() => setCompletingTaskId(null)}
                      className="text-black shadow-md px-5 rounded-full text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {tasks?.length ===0 && <div className="flex-wrap min-h-10">
                  <p className={`text-center text-sm font-medium`}>No Tasks for today</p>
                </div>}
          <button onClick={() => navigate("/member/tasks")} className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-100 transition-colors">
            View All Tasks <ArrowRight className="w-4 h-4" />
          </button>
        </Card>

        <div className="space-y-5">
          <Card title="Recent Messages">
            <div className="space-y-3 mb-4">
              {recentMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">{msg.from.split(" ").map((w) => w[0]).join("")}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-gray-900">{msg.from}</span>
                      {msg.unread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                      <span className="text-xs text-gray-400 ml-auto">{msg.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/member/chat")} className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl border border-blue-100 transition-colors">
              Open Chat <ArrowRight className="w-4 h-4" />
            </button>
          </Card>

          <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
            <h3 className="font-semibold mb-1">Quick Actions</h3>
            <p className="text-blue-200 text-sm mb-4">Jump right into your work</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New Task", icon: Plus, path: "/member/tasks" },
                { label: "My Calendar", icon: Calendar, path: "/member/calendar" },
                { label: "Open Chat", icon: MessageSquare, path: "/member/chat" },
                { label: "My Files", icon: FolderOpen, path: "/member/files" },
              ].map(({ label, icon: Icon, path }) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm rounded-xl py-2.5 px-3 text-sm font-medium transition-colors"
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard