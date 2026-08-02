import { Card } from "../../components/ui/Card";
import {
  Plus, Clock, Users, CheckCircle2, X, MoreVertical,
  Edit2, Trash2, ExternalLink, Calendar, FolderKanban,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const TEAM_MEMBERS = [
  { name: "Emily Davis", avatar: "ED" },
  { name: "John Smith", avatar: "JS" },
  { name: "Lisa Wong", avatar: "LW" },
  { name: "David Miller", avatar: "DM" },
  { name: "Sarah Johnson", avatar: "SJ" },
];

const initialProjects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete redesign of the company website with modern UI/UX principles.",
    status: "In Progress",
    progress: 65,
    team: ["Emily Davis", "John Smith", "Lisa Wong"],
    teamAvatars: ["ED", "JS", "LW"],
    deadline: "2026-05-30",
    tasks: { total: 45, completed: 29, pending: 16 },
    priority: "high",
  },
  {
    id: 2,
    name: "Mobile App Launch",
    description: "Build and launch the cross-platform mobile application.",
    status: "In Progress",
    progress: 40,
    team: ["John Smith", "Lisa Wong"],
    teamAvatars: ["JS", "LW"],
    deadline: "2026-06-15",
    tasks: { total: 62, completed: 25, pending: 37 },
    priority: "high",
  },
  {
    id: 3,
    name: "API Integration",
    description: "Integrate payment gateway and analytics APIs into the platform.",
    status: "Completed",
    progress: 100,
    team: ["David Miller", "John Smith"],
    teamAvatars: ["DM", "JS"],
    deadline: "2026-05-20",
    tasks: { total: 28, completed: 28, pending: 0 },
    priority: "medium",
  },
];

const statusColors = {
  "Completed": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Planning": "bg-amber-100 text-amber-700",
  "On Hold": "bg-gray-100 text-gray-600",
};

const priorityDot = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-emerald-500",
};

const avatarGradients = [
  "from-blue-500 to-blue-600",
  "from-violet-500 to-violet-600",
  "from-rose-500 to-rose-600",
  "from-teal-500 to-teal-600",
  "from-orange-500 to-orange-600",
];

const DEFAULT_FORM = {
  name: "",
  description: "",
  status: "Planning",
  deadline: "",
  totalTasks: "10",
  priority: "medium",
  selectedMembers: [],
};

const MyProjects = ()=> {
  const [projects, setProjects] = useState(initialProjects);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showActions, setShowActions] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
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
      priority: p.priority,
      selectedMembers: p.team,
    });
    setEditingId(p.id);
    setShowModal(true);
    setShowActions(null);
  };

  const toggleMember = (name) =>
    setForm((f) => ({
      ...f,
      selectedMembers: f.selectedMembers.includes(name)
        ? f.selectedMembers.filter((m) => m !== name)
        : [...f.selectedMembers, name],
    }));

  const saveProject = () => {
    if (!form.name.trim()) return;
    const avatars = form.selectedMembers.map(
      (name) => TEAM_MEMBERS.find((m) => m.name === name)?.avatar ?? name.substring(0, 2).toUpperCase()
    );
    const total = parseInt(form.totalTasks) || 0;
    const progress =
      form.status === "Completed" ? 100 : form.status === "Planning" ? 5 : Math.round(Math.random() * 50 + 20);

    if (editingId !== null) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? {
                ...p,
                name: form.name,
                description: form.description,
                status: form.status,
                deadline: form.deadline,
                team: form.selectedMembers,
                teamAvatars: avatars,
                priority: form.priority,
                tasks: { total, completed: p.tasks.completed, pending: Math.max(0, total - p.tasks.completed) },
              }
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
        tasks: { total, completed: 0, pending: total },
        priority: form.priority,
      };
      setProjects((prev) => [newProject, ...prev]);
      showToast("Project created!");
    }
    setShowModal(false);
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirm(null);
    showToast("Project deleted");
  };

  const filtered =
    statusFilter === "All Status"
      ? projects
      : projects.filter((p) => p.status === statusFilter);

  const formatDeadline = (d) => {
    if (!d) return "—";
    try {
      return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return d;
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">{projects.length} projects · {projects.filter(p => p.status === "In Progress").length} active</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: projects.length, color: "bg-gray-50 border-gray-100", text: "text-gray-900" },
          { label: "In Progress", value: projects.filter(p => p.status === "In Progress").length, color: "bg-blue-50 border-blue-100", text: "text-blue-700" },
          { label: "Completed", value: projects.filter(p => p.status === "Completed").length, color: "bg-emerald-50 border-emerald-100", text: "text-emerald-700" },
          { label: "Planning", value: projects.filter(p => p.status === "Planning").length, color: "bg-amber-50 border-amber-100", text: "text-amber-700" },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-xl border ${s.color}`}>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {["All Status", "Planning", "In Progress", "Completed", "On Hold"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No {statusFilter !== "All Status" ? statusFilter.toLowerCase() : ""} projects</p>
          <button onClick={openCreate} className="mt-2 text-sm text-blue-600 hover:underline font-medium">
            Create a new project
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((project) => (
          <Card key={project.id}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${priorityDot[project.priority]}`} />
                    <Link
                      to={`/manager/project/${project.id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate"
                    >
                      {project.name}
                    </Link>
                  </div>
                  {project.description && (
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2 pl-4">{project.description}</p>
                  )}
                  <div className="pl-4">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold ${statusColors[project.status]}`}>
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <div className="flex -space-x-2">
                    {project.teamAvatars.slice(0, 3).map((av, idx) => (
                      <div
                        key={idx}
                        className={`w-7 h-7 bg-linear-to-br ${avatarGradients[idx % avatarGradients.length]} rounded-full flex items-center justify-center border-2 border-white`}
                        title={project.team[idx]}
                      >
                        <span className="text-white text-[9px] font-bold">{av}</span>
                      </div>
                    ))}
                    {project.team.length > 3 && (
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white">
                        <span className="text-gray-600 text-[9px] font-bold">+{project.team.length - 3}</span>
                      </div>
                    )}
                  </div>
                  <div className="relative" ref={showActions === project.id ? actionsRef : undefined}>
                    <button
                      onClick={() => setShowActions(showActions === project.id ? null : project.id)}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    {showActions === project.id && (
                      <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-20">
                        <Link
                          to={`/manager/project/${project.id}`}
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
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-500 font-medium">Progress</span>
                  <span className="font-bold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-xl font-bold text-gray-900">{project.tasks.total}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-medium uppercase tracking-wide">Total</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-xl font-bold text-emerald-700">{project.tasks.completed}</p>
                  <p className="text-[10px] text-emerald-600 mt-0.5 font-medium uppercase tracking-wide">Done</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-xl font-bold text-blue-700">{project.tasks.pending}</p>
                  <p className="text-[10px] text-blue-600 mt-0.5 font-medium uppercase tracking-wide">Pending</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {project.team.length} member{project.team.length !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-1.5">
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
              "{projects.find((p) => p.id === deleteConfirm)?.name}" will be permanently deleted.
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
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Project Name *</label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Q3 Marketing Campaign"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Brief overview of this project..."
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>

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
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

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

              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Team Members
                  {form.selectedMembers.length > 0 && (
                    <span className="ml-2 text-xs font-normal text-blue-600">{form.selectedMembers.length} selected</span>
                  )}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TEAM_MEMBERS.map((member) => {
                    const selected = form.selectedMembers.includes(member.name);
                    return (
                      <button
                        key={member.name}
                        onClick={() => toggleMember(member.name)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          selected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-linear-to-br ${selected ? "from-blue-500 to-blue-600" : "from-gray-400 to-gray-500"}`}>
                          <span className="text-white text-[9px] font-bold">{member.avatar}</span>
                        </div>
                        <span className={`text-xs font-semibold truncate ${selected ? "text-blue-700" : "text-gray-700"}`}>{member.name}</span>
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

export default MyProjects;