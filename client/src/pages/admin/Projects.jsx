import { Card, StatCard } from "../../components/ui/Card";
import {
  FolderKanban, Clock, CheckCircle2, AlertCircle, Plus, MoreVertical,
  X, Trash2, Edit2, ExternalLink, Users, Calendar, ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import { createProject, getProjects, getProjectsStats, getUsers, updateProject } from "../../services/organisation.services";
import { useDispatch, useSelector } from "react-redux";
import { storeProjects, storeProjectsStats, storeUsers } from "../../store/features/orgSlice.js";

const statusColors = {
  "Completed": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Planning": "bg-amber-100 text-amber-700",
  "On Hold": "bg-gray-100 text-gray-600",
};

const healthDot = {
  Good: "bg-emerald-500",
  Warning: "bg-amber-500",
  Critical: "bg-red-500",
};

const avatarGradients = [
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-rose-500 to-rose-600",
  "from-teal-500 to-teal-600",
  "from-orange-500 to-orange-600",
  "from-indigo-500 to-indigo-600",
];

const DEFAULT_FORM = {
  title: "",
  description: "",
  status: "Planning",
  deadline: "",
  members: [],
  health: "Good",
};

const Projects = ()=> {
  const { projects } = useSelector(state=>state.organisation);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showActions, setShowActions] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const actionsRef = useRef(null);
  const dispatch = useDispatch();
  const { projectsStats } = useSelector(state=>state.organisation);
  const ALL_MEMBERS = useSelector(state=>state.organisation.users)

  if(!projects){
    return <h1>Loading ...</h1>
  }

  useEffect(() => {
    const handler = (e) => {
      if (!actionsRef.current?.contains(e.target)) setShowActions(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(()=>{
    getProjectsStatsData();
    getProjectsData();
    fetchUser();
  },[dispatch]);

  const getProjectsStatsData = async()=>{
    try {
      const res = await getProjectsStats();
      dispatch(storeProjectsStats(res?.data));
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  const getProjectsData = async()=>{
    try {
      const res = await getProjects();
      dispatch(storeProjects(res?.data));
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  const fetchUser = async ()=>{
    try {
      const users = await getUsers();
      dispatch(storeUsers(users?.data));

    } catch (error) {
      console.log(error?.response?.data?.message)
    }
  }

  const totalPercentageOfInProgressProject = Math.round(projectsStats && projectsStats.allProjects>0 ? projectsStats.inProgressProjects/projectsStats.allProjects*100 : 0 );

  //updated code till here

  const openCreate = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({
      title: p.name,
      description: p.description,
      status: p.status,
      deadline: p.deadline,
      members: p.team ? p.team.map(member => member._id || member) : [],
      health: p.health,
    });
    setEditingId(p.id);
    setShowModal(true);
    setShowActions(null);
  };

  const toggleMember = (_id) => {
    setForm((f) => ({
      ...f,
      members: f.members.includes(_id)
        ? f.members.filter((m) => m !== _id)
        : [...f.members, _id],
    }));
  };

  const saveProject = async () => {
    if(!editingId){
      createNewProject();
    }else{
      updateExistedProject();
    }
  };

  const updateExistedProject = async ()=>{
    try {
      const project = await updateProject(form,editingId);
      getProjectsData();
      getProjectsStatsData();
      setForm(DEFAULT_FORM);
      setShowModal(false);
      toast.success(project?.message)
      setEditingId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log(error?.response?.data?.message)
    }
  }

  const createNewProject = async()=>{
    try {
      const project = await createProject(form);
      getProjectsData();
      getProjectsStatsData();
      setForm(DEFAULT_FORM);
      setShowModal(false);
      toast.success(project?.message)
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log(error?.response?.data?.message)
    }
  }

  let filtered = [];
  if(projects){
    filtered = statusFilter === "All" ? projects : projects.filter((p) => p.status === statusFilter);
  }
   

  const formatDeadline = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Projects</h1>
          <p className="text-gray-600">Monitor and manage all company projects</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={projectsStats?.allProjects || "0"} change={`+${projectsStats?.projectsCreatedThisMonth || "0"} this month`} icon={<FolderKanban className="w-6 h-6" />} trend="up" />
        <StatCard title="In Progress" value={projectsStats?.inProgressProjects || "0"} change={`${totalPercentageOfInProgressProject}% of total`} icon={<Clock className="w-6 h-6" />} trend="neutral" />
        <StatCard title="Completed" value={projectsStats?.completedProjects || "0"} change={`+${projectsStats?.completedThisWeek || "0"} this week`} icon={<CheckCircle2 className="w-6 h-6" />} trend={projectsStats?.completedThisWeek > 0 ? "up" : "neutral"} />
        <StatCard title="At Risk" value={projectsStats?.atRiskProjects || "0"} change={projectsStats?.atRiskProjects > 0 ? "Needs attention" : "All healthy"} icon={<AlertCircle className="w-6 h-6" />} trend={projectsStats?.atRiskProjects > 0 ? "down" : "up"} />
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        {["All", "Planning", "In Progress", "Completed", "On Hold"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s} {s !== "All" && <span className="ml-1 opacity-70">{projects.filter(p => p.status === s).length}</span>}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No projects found</p>
          <button onClick={openCreate} className="mt-3 text-sm text-blue-600 hover:underline font-medium">Create your first project</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((project,index) => {
          return <Card key={project?.id || index}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Link to={`/admin/project/${project.id}`} className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                      {project.name}
                    </Link>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">{project.description}</p>
                  )}
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${healthDot[project.health]}`} />
                      <span className="text-xs text-gray-400 capitalize">{project.health}</span>
                    </div>
                  </div>
                </div>
                <div className="relative shrink-0 ml-3" ref={showActions === project.id ? actionsRef : undefined}>
                  <button
                    onClick={() => setShowActions(showActions === project.id ? null : project.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {showActions === project.id && (
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-20">
                      <Link
                        to={`/admin/project/${project.id}`}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => setShowActions(null)}
                      >
                        <ExternalLink className="w-4 h-4" /> Open
                      </Link>
                      <button
                        onClick={() => openEdit(project)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <div className="my-1 border-t border-gray-100" />
                      <button
                        onClick={() => { setDeleteConfirm(project.id); setShowActions(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500 font-medium">Progress</span>
                  <span className="font-semibold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${project.health === "Critical" ? "bg-red-500" : project.health === "Warning" ? "bg-amber-500" : "bg-blue-500"}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {(project.team || []).slice(0, 4).map((member, idx) => {
                      // Sirf pehla letter nikalne ke liye substring ki jagah charAt(0)
                      const firstLetter = member?.name ? member.name.charAt(0).toUpperCase() : "?";
                      return (
                        <div
                          key={member._id || idx}
                          className={`w-7 h-7 bg-linear-to-br ${avatarGradients[idx % avatarGradients.length]} rounded-full flex items-center justify-center border-2 border-white`}
                          title={member?.name || "Member"}
                        >
                          {member?.avatar ? (
                            <img src={member.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            // Font size text-[9px] se badha kar text-xs kar diya
                            <span className="text-white text-xs font-bold">{firstLetter}</span>
                          )}
                        </div>
                      )
                    })}
                    {(project.team?.length || 0) > 4 && (
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white z-10">
                        {/* Yahan bhi font size thoda clear kiya hai */}
                        <span className="text-gray-600 text-[10px] font-bold">+{project.team.length - 4}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">0</span>/{project.taskCount || 0} tasks
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDeadline(project.deadline)}
                </div>
              </div>
            </div>
          </Card>
        }
          
        )}
      </div>

      {/* Delete confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Project?</h3>
            <p className="text-sm text-gray-500 mb-6">
              "{projects?.find((p) => p.id === deleteConfirm)?.name}" will be permanently deleted. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={() => deleteProject(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId !== null ? "Edit Project" : "Create New Project"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Project Name *</label>
                <input
                  autoFocus
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Mobile App v2"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this project about?"
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>

              {/* Status + Health */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option>Planning</option>
                    <option>In Progress</option>
                    <option>On Hold</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Health</label>
                  <select
                    value={form.health}
                    onChange={(e) => setForm({ ...form, health: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option>Good</option>
                    <option>Warning</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              {/* Deadline + Tasks */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />Deadline
                  </label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Team members */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  Team Members
                  {form.members.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-blue-600">{form.members.length} selected</span>
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(ALL_MEMBERS || []).map((member) => {
                    const selected = form.members.includes(member._id);
                    return (
                      <button
                        key={member._id}
                        onClick={() => toggleMember(member._id)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          selected
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-linear-to-br ${
                          selected ? "from-blue-500 to-blue-600" : "from-gray-400 to-gray-500"
                        }`}>
                          <span className="text-white text-[9px] font-bold">{member.avatar}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{member.name}</p>
                          <p className={`text-[10px] ${selected ? "text-blue-500" : "text-gray-400"}`}>{member.role}</p>
                        </div>
                        {selected && <CheckCircle2 className="w-4 h-4 text-blue-500 ml-auto shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveProject}
                disabled={!form.title.trim()}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                {editingId !== null ? "Save Changes" : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;