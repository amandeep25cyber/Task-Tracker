import { Card } from "./ui/Card";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, MessageSquare, FileText, CheckSquare, Settings, Send, Download, Share2, Plus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { KanbanBoard } from "./ui/KanbanBoard";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createNewTask, getSingleProject, taskStatusUpdate } from "../services/organisation.services";
import { createNewTaskByManager, getProjectDataById, updateTaskStatus } from "../services/manager.services";

const tabs = [
  { id: "overview", label: "Overview", icon: CheckSquare },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "files", label: "Files", icon: FileText },
];

const recentActivity = [
  { user: "Emily Davis", action: "completed task", task: "Homepage wireframe", time: "2 hours ago" },
  { user: "John Smith", action: "updated", task: "Navigation component", time: "5 hours ago" },
  { user: "Lisa Wong", action: "commented on", task: "Color scheme", time: "1 day ago" },
];

const seedChat = [
  { id: 1, user: "Emily Davis", avatar: "ED", text: "Hey team, I've pushed the updated wireframes to Figma.", time: "9:15 AM", isOwn: false },
  { id: 2, user: "John Smith", avatar: "JS", text: "Looks great! Starting the implementation now.", time: "9:22 AM", isOwn: false },
  { id: 3, user: "You", avatar: "ME", text: "The hero animation looks smooth, nice work.", time: "9:30 AM", isOwn: true },
];

const projectFiles = [
  { id: 1, name: "Homepage Design.fig", size: "2.4 MB", author: "Emily Davis", modified: "2 hours ago", type: "design" },
  { id: 2, name: "Project Brief.pdf", size: "856 KB", author: "Mike Chen", modified: "1 day ago", type: "document" },
  { id: 3, name: "Wireframes.sketch", size: "3.2 MB", author: "Emily Davis", modified: "2 days ago", type: "design" },
  { id: 4, name: "Component Specs.docx", size: "1.1 MB", author: "John Smith", modified: "3 days ago", type: "document" },
];

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const DEFAULT_PROJECT = {
  name: "",
  description: "",
  status: "In Progress",
  progress: 0,
  startDate: "-",
  endDate: "-",
  team: [
    { name: "", role: "", avatar: "" }
  ],
  stats: { total: 0, completed: 0, inProgress: 0, todo: 0 },
}

const DEFAULT_TASK = {
  title:"",
  description:"",
  priority:"low",
  status:"todo",
  assignedTo:"",
  deadline:"",
  project:"",
  tags:"",
}

const ProjectDetail = ({ role }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [projectData,setProjectData] = useState(DEFAULT_PROJECT);
  const [showNewTask,setShowNewTask] = useState(false);
  const [newTask,setNewTask] = useState(DEFAULT_TASK);
  const basePath = `/${role}`;

  useEffect(()=>{
    getProjectData();
  },[])

  const getProjectData = async () =>{
    try {
      let projectData ;
      if(role==="admin"){
        projectData = await getSingleProject(id);
      }else{
        projectData = await getProjectDataById(id);
      }
      const pData = projectData?.data?.project;
      const tasksData = projectData?.data?.tasks;
      setNewTask((prev)=>({...prev,project:pData._id}))
      
      setProjectData({
        name: pData.title,
        description: pData.description,
        status: pData.status,
        progress: pData.taskCount === 0 ? 0 : Math.round(tasksData.done.length/pData.taskCount *100) ,
        startDate: pData.createdAt,
        endDate: pData.deadline || "-",
        team: pData.members,
        stats: { total: pData.taskCount, completed: tasksData.done.length, inProgress: tasksData.inProgress.length, todo: tasksData.todo.length },
      })

      setTasks(tasksData);

    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  // Tasks state
  const [tasks, setTasks] = useState({});
  const handleTaskMove = async(taskId, toColumn) => {
    const fromCol = (["todo", "inProgress", "done"]).find((c) =>
      tasks[c].some((t) => t._id === taskId)
    );
    if (!fromCol || fromCol === toColumn) return;
    const task = tasks[fromCol].find((t) => t._id === taskId);
    if(!task) return;
    
    let status = toColumn;
    if(toColumn==="inProgress"){
      status = "in-progress";
    }
    const isSuccess = await updateStatusOfTask(status,task._id);
    if(!isSuccess) return ;

    setTasks((prev) => ({
      ...prev,
      [fromCol]: prev[fromCol].filter((t) => t._id !== taskId),
      [toColumn]: [...prev[toColumn], task],
    }));
  };

  const updateStatusOfTask = async(status,id)=>{
    try {
      if(role==="admin") await taskStatusUpdate(status,id);
      else await updateTaskStatus(status,id)
      getProjectData();
      return true;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
      return false;
    }
  }

  const addTask = async() =>{
    try {
      console.log(newTask)
      if(role==="admin") await createNewTask(newTask);
      else await createNewTaskByManager(newTask);
      getProjectData();
      setShowNewTask(false);
      setNewTask(DEFAULT_TASK);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  // Chat state
  const [chatMessages, setChatMessages] = useState(seedChat);
  const [chatDraft, setChatDraft] = useState("");
  const chatBottomRef = useRef(null);
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length, activeTab]);

  const sendChatMessage = () => {
    const text = chatDraft.trim();
    if (!text) return;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now(), user: "You", avatar: "ME", text, time: now(), isOwn: true },
    ]);
    setChatDraft("");
  };

  const formatDate = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; }
  };

  return (
    <div className="space-y-6">
      <Link to={`${basePath}/projects`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Projects
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{projectData.name}</h1>
          <p className="text-gray-500">{projectData.description}</p>
        </div>
        {(role === "admin" || role === "manager") && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Status", value: <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">{projectData.status}</span> },
          { label: "Progress", value: <><p className="text-2xl font-bold text-gray-900">{projectData.progress}%</p><div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${projectData.progress}%` }} /></div></> },
          { label: "Start Date", value: <p className="font-semibold text-gray-900 text-sm">{formatDate(projectData.startDate)}</p> },
          { label: "Due Date", value: <p className="font-semibold text-gray-900 text-sm">{formatDate(projectData.endDate)}</p> },
        ].map((item) => (
          <Card key={item.label}>
            <div className="p-4">
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">{item.label}</p>
              {item.value}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="border-b border-gray-100">
          <div className="flex gap-1 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 border-b-2 transition-colors text-sm font-medium ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Task Progress</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Tasks", value: projectData.stats.total, bg: "bg-gray-50", text: "text-gray-900" },
                    { label: "Completed", value: projectData.stats.completed, bg: "bg-emerald-50", text: "text-emerald-700" },
                    { label: "In Progress", value: projectData.stats.inProgress, bg: "bg-blue-50", text: "text-blue-700" },
                    { label: "To Do", value: projectData.stats.todo, bg: "bg-amber-50", text: "text-amber-700" },
                  ].map((s) => (
                    <div key={s.label} className={`text-center p-5 ${s.bg} rounded-xl`}>
                      <p className={`text-3xl font-bold ${s.text} mb-1`}>{s.value}</p>
                      <p className="text-sm text-gray-600">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {projectData.team.map((member,idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white font-semibold text-sm">{member.avatar || member.name.slice(0,2).toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-violet-500 rounded-full flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">{a.user.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{a.user}</span>{" "}
                          {a.action}{" "}
                          <span className="font-semibold">{a.task}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TASKS */}
          {activeTab === "tasks" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Project Tasks</h3>
                {(role === "admin" || role === "manager") && (
                  <button onClick={()=>setShowNewTask(true)} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                    <Plus className="w-4 h-4" /> Add Task
                  </button>
                )}
              </div>
              <KanbanBoard
                todoTasks={tasks?.todo}
                inProgressTasks={tasks?.inProgress}
                doneTasks={tasks?.done}
                onTaskMove={handleTaskMove}
              />
            </div>
          )}

          {/* CHAT */}
          {activeTab === "chat" && (
            <div className="flex flex-col h-96">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                {chatMessages.map((msg, idx) => {
                  const showHeader = idx === 0 || chatMessages[idx - 1].user !== msg.user;
                  return (
                    <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                      {showHeader ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.isOwn ? "bg-linear-to-br from-blue-500 to-blue-600" : "bg-linear-to-br from-violet-500 to-violet-600"}`}>
                          <span className="text-white text-[10px] font-semibold">{msg.avatar}</span>
                        </div>
                      ) : (
                        <div className="w-8 shrink-0" />
                      )}
                      <div className={`flex flex-col ${msg.isOwn ? "items-end" : "items-start"} max-w-xs`}>
                        {showHeader && (
                          <div className={`flex items-baseline gap-2 mb-1 ${msg.isOwn ? "flex-row-reverse" : ""}`}>
                            <span className="text-xs font-semibold text-gray-700">{msg.user}</span>
                            <span className="text-[10px] text-gray-400">{msg.time}</span>
                          </div>
                        )}
                        <div className={`px-3.5 py-2 rounded-xl text-sm leading-relaxed ${msg.isOwn ? "bg-blue-600 text-white rounded-tr-sm" : "bg-gray-100 text-gray-900 rounded-tl-sm"}`}>
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                <input
                  type="text"
                  value={chatDraft}
                  onChange={(e) => setChatDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChatMessage(); } }}
                  placeholder="Message the team..."
                  className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={sendChatMessage}
                  disabled={!chatDraft.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* FILES */}
          {activeTab === "files" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-gray-900">Project Files</h3>
                {(role === "admin" || role === "manager") && (
                  <button className="flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    <Plus className="w-4 h-4" /> Upload
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {projectFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${file.type === "design" ? "bg-violet-100" : "bg-blue-100"}`}>
                      <FileText className={`w-5 h-5 ${file.type === "design" ? "text-violet-600" : "text-blue-600"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{file.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{file.author} · {file.modified} · {file.size}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Share">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Adding Task Form */}
      {showNewTask && (
              <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
                    <button onClick={() => setShowNewTask(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Title *</label>
                      <input
                        autoFocus
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Task title"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
                      <textarea
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Optional description..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">Priority</label>
                        <select
                          value={newTask.priority}
                          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option>low</option>
                          <option>medium</option>
                          <option>high</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1.5">Column</label>
                        <select
                          value={newTask.status}
                          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                        >
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Deadline</label>
                      <input
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                        placeholder=""
                        type="date"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                      <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Assignee</label>
                      <select
                        value={newTask.assignedTo}
                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      >
                        <option value="">Unassigned</option>
                        {(projectData.team || []).map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}
                      </select>
                    </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1.5">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                      <input
                        value={newTask.tags}
                        onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                        placeholder="Frontend, API, Design"
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowNewTask(false)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addTask}
                      disabled={!newTask.title.trim()}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40"
                    >
                      Create Task
                    </button>
                  </div>
                </div>
              </div>
            )}
    </div>
  );
}

export default ProjectDetail;