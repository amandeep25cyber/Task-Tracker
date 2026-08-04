import { Card, StatCard } from "../../components/ui/Card";
import {
  FolderKanban, Clock, CheckCircle2, AlertCircle, Plus, MoreVertical,
  X, Trash2, Edit2, ExternalLink, Users, Calendar, ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const ALL_MEMBERS = [
  { name: "Sarah Johnson", avatar: "SJ", role: "Admin" },
  { name: "Mike Chen", avatar: "MC", role: "Project Manager" },
  { name: "Emily Davis", avatar: "ED", role: "Designer" },
  { name: "John Smith", avatar: "JS", role: "Developer" },
  { name: "Lisa Wong", avatar: "LW", role: "Developer" },
  { name: "David Miller", avatar: "DM", role: "Developer" },
];

const initialProjects = [
  { id: 1, name: "Website Redesign", description: "Complete redesign of the company website with modern UI/UX principles.", status: "In Progress", progress: 65, team: ["Sarah Johnson", "Mike Chen", "Emily Davis"], teamAvatars: ["SJ", "MC", "ED"], deadline: "2026-05-30", tasks: { total: 45, completed: 29 }, health: "good", createdAt: "2026-04-01" },
  { id: 2, name: "Mobile App Launch", description: "Develop and launch the iOS/Android app for our platform.", status: "In Progress", progress: 40, team: ["John Smith", "Lisa Wong"], teamAvatars: ["JS", "LW"], deadline: "2026-06-15", tasks: { total: 62, completed: 25 }, health: "warning", createdAt: "2026-03-15" },
  { id: 3, name: "API Integration", description: "Integrate third-party payment and analytics APIs.", status: "Completed", progress: 100, team: ["Mike Chen", "David Miller"], teamAvatars: ["MC", "DM"], deadline: "2026-05-20", tasks: { total: 28, completed: 28 }, health: "good", createdAt: "2026-02-01" },
  { id: 4, name: "Security Audit", description: "Comprehensive security review of all production systems.", status: "Planning", progress: 15, team: ["Sarah Johnson", "Emily Davis", "John Smith"], teamAvatars: ["SJ", "ED", "JS"], deadline: "2026-07-01", tasks: { total: 35, completed: 5 }, health: "critical", createdAt: "2026-04-20" },
];

const statusColors = {
  "Completed": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Planning": "bg-amber-100 text-amber-700",
  "On Hold": "bg-gray-100 text-gray-600",
};

const healthDot = {
  good: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-red-500",
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
  name: "",
  description: "",
  status: "Planning",
  deadline: "",
  totalTasks: "10",
  selectedMembers: [],
  health: "good",
};

const Projects = ()=> {
  const [projects, setProjects] = useState(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showActions, setShowActions] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!actionsRef.current?.contains(e.target)) setShowActions(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setForm(DEFAULT_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      status: p.status,
      deadline: p.deadline,
      totalTasks: String(p.tasks.total),
      selectedMembers: p.team,
      health: p.health,
    });
    setEditingId(p.id);
    setShowModal(true);
    setShowActions(null);
  };

  const toggleMember = (name) => {
    setForm((f) => ({
      ...f,
      selectedMembers: f.selectedMembers.includes(name)
        ? f.selectedMembers.filter((m) => m !== name)
        : [...f.selectedMembers, name],
    }));
  };

  const saveProject = () => {
    if (!form.name.trim()) return;
    const avatars = form.selectedMembers.map(
      (name) => ALL_MEMBERS.find((m) => m.name === name)?.avatar ?? name.substring(0, 2).toUpperCase()
    );
    const total = parseInt(form.totalTasks) || 0;
    const progress = form.status === "Completed" ? 100 : form.status === "Planning" ? 0 : Math.round(Math.random() * 60 + 20);

    if (editingId !== null) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, name: form.name, description: form.description, status: form.status, deadline: form.deadline, team: form.selectedMembers, teamAvatars: avatars, health: form.health, tasks: { ...p.tasks, total } }
            : p
        )
      );
      showToast("Project updated");
    } else {
      const newProject = {
        id: Date.now(),
        name: form.name,
        description: form.description,
        status: form.status,
        progress,
        team: form.selectedMembers,
        teamAvatars: avatars,
        deadline: form.deadline,
        tasks: { total, completed: 0 },
        health: form.health,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProjects((prev) => [newProject, ...prev]);
      showToast("Project created successfully");
    }
    setShowModal(false);
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    setShowActions(null);
    showToast("Project deleted");
  };

  const filtered = statusFilter === "All" ? projects : projects.filter((p) => p.status === statusFilter);

  const totalCount = projects.length;
  const inProgressCount = projects.filter((p) => p.status === "In Progress").length;
  const completedCount = projects.filter((p) => p.status === "Completed").length;
  const atRiskCount = projects.filter((p) => p.health === "critical" || p.health === "warning").length;

  const formatDeadline = (d) => {
    if (!d) return "—";
    try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); } catch { return d; }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

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
        <StatCard title="Total Projects" value={String(totalCount)} change={`+${projects.filter(p => p.createdAt >= new Date(Date.now() - 30*24*60*60*1000).toISOString().split('T')[0]).length} this month`} icon={<FolderKanban className="w-6 h-6" />} trend="up" />
        <StatCard title="In Progress" value={String(inProgressCount)} change={`${Math.round(inProgressCount/totalCount*100) || 0}% of total`} icon={<Clock className="w-6 h-6" />} trend="neutral" />
        <StatCard title="Completed" value={String(completedCount)} change="+3 this week" icon={<CheckCircle2 className="w-6 h-6" />} trend="up" />
        <StatCard title="At Risk" value={String(atRiskCount)} change={atRiskCount > 0 ? "Needs attention" : "All healthy"} icon={<AlertCircle className="w-6 h-6" />} trend={atRiskCount > 0 ? "down" : "up"} />
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
        {filtered.map((project) => (
          <Card key={project.id}>
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
                        to={`/project/${project.id}`}
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
                    className={`h-2 rounded-full transition-all ${project.health === "critical" ? "bg-red-500" : project.health === "warning" ? "bg-amber-500" : "bg-blue-500"}`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {project.teamAvatars.slice(0, 4).map((av, idx) => (
                      <div
                        key={idx}
                        className={`w-7 h-7 bg-linear-to-br ${avatarGradients[idx % avatarGradients.length]} rounded-full flex items-center justify-center border-2 border-white`}
                        title={project.team[idx]}
                      >
                        <span className="text-white text-[9px] font-bold">{av}</span>
                      </div>
                    ))}
                    {project.team.length > 4 && (
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-gray-600 text-[9px] font-bold">+{project.team.length - 4}</span>
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{project.tasks.completed}</span>/{project.tasks.total} tasks
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDeadline(project.deadline)}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Delete confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Project?</h3>
            <p className="text-sm text-gray-500 mb-6">
              "{projects.find((p) => p.id === deleteConfirm)?.name}" will be permanently deleted. This cannot be undone.
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
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    <option value="good">Good</option>
                    <option value="warning">Warning</option>
                    <option value="critical">Critical</option>
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
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />Total Tasks
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.totalTasks}
                    onChange={(e) => setForm({ ...form, totalTasks: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Team members */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  <Users className="w-3.5 h-3.5 inline mr-1" />
                  Team Members
                  {form.selectedMembers.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-blue-600">{form.selectedMembers.length} selected</span>
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_MEMBERS.map((member) => {
                    const selected = form.selectedMembers.includes(member.name);
                    return (
                      <button
                        key={member.name}
                        onClick={() => toggleMember(member.name)}
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
                disabled={!form.name.trim()}
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