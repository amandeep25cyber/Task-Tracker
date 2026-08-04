import { Card } from "../../components/ui/Card";
import { Users, Plus, MoreVertical, X, Search, Edit2, Trash2, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LEADS = ["Mike Chen", "Sarah Johnson", "Emily Davis", "John Smith", "Lisa Wong", "David Miller"];
const COLORS = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-teal-500"];

const initialTeams = [
  { id: 1, name: "Development Team", description: "Frontend and backend development across all platforms.", lead: "Mike Chen", members: 12, projects: 5, color: "bg-blue-500" },
  { id: 2, name: "Design Team", description: "UI/UX design, branding, and visual communication.", lead: "Sarah Johnson", members: 6, projects: 8, color: "bg-violet-500" },
  { id: 3, name: "Marketing Team", description: "Digital marketing, content creation, and growth.", lead: "Emily Davis", members: 8, projects: 3, color: "bg-emerald-500" },
  { id: 4, name: "QA Team", description: "Quality assurance, testing, and release validation.", lead: "John Smith", members: 5, projects: 7, color: "bg-rose-500" },
];

const DEFAULT_FORM = { name: "", description: "", lead: "Mike Chen", members: "5", projects: "2", color: "bg-blue-500" };

const Teams = ()=> {
  const [teams, setTeams] = useState(initialTeams);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [showActions, setShowActions] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!actionsRef.current?.contains(e.target)) setShowActions(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const openCreate = () => { setForm(DEFAULT_FORM); setEditingId(null); setShowModal(true); };
  const openEdit = (t) => {
    setForm({ name: t.name, description: t.description, lead: t.lead, members: String(t.members), projects: String(t.projects), color: t.color });
    setEditingId(t.id); setShowModal(true); setShowActions(null);
  };

  const save = () => {
    if (!form.name.trim()) return;
    if (editingId !== null) {
      setTeams((p) => p.map((t) => t.id === editingId ? { ...t, ...form, members: parseInt(form.members) || 0, projects: parseInt(form.projects) || 0 } : t));
      showToast("Team updated");
    } else {
      setTeams((p) => [{ id: Date.now(), ...form, members: parseInt(form.members) || 0, projects: parseInt(form.projects) || 0 }, ...p]);
      showToast("Team created");
    }
    setShowModal(false);
  };

  const deleteTeam = (id) => { setTeams((p) => p.filter((t) => t.id !== id)); setDeleteConfirm(null); showToast("Team deleted"); };

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.lead.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const fakeMembers = (team) => {
    const names = ["Emily Davis", "John Smith", "Lisa Wong", "David Miller", "Sarah Johnson", "Mike Chen"];
    return names.slice(0, Math.min(team.members, 4));
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Teams</h1><p className="text-gray-600">{teams.length} teams · {teams.reduce((a, t) => a + t.members, 0)} total members</p></div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Create Team
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search teams or leads..." className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-3.5 h-3.5" /></button>}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No teams found</p>
          <button onClick={openCreate} className="mt-2 text-sm text-blue-600 hover:underline font-medium">Create a team</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((team) => (
          <Card key={team.id}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${team.color} rounded-xl flex items-center justify-center`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="relative" ref={showActions === team.id ? actionsRef : undefined}>
                  <button onClick={() => setShowActions(showActions === team.id ? null : team.id)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>
                  {showActions === team.id && (
                    <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-20">
                      <button onClick={() => openEdit(team)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit Team</button>
                      <div className="my-1 border-t border-gray-100" />
                      <button onClick={() => { setDeleteConfirm(team.id); setShowActions(null); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</button>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{team.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{team.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Team Lead</span><span className="font-medium text-gray-900">{team.lead}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Members</span><span className="font-medium text-gray-900">{team.members}</span></div>
                <div className="flex items-center justify-between text-sm"><span className="text-gray-500">Active Projects</span><span className="font-medium text-gray-900">{team.projects}</span></div>
              </div>

              <button
                onClick={() => setExpandedId(expandedId === team.id ? null : team.id)}
                className="w-full py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 flex items-center justify-center gap-2"
              >
                {expandedId === team.id ? <><ChevronUp className="w-4 h-4" /> Hide Details</> : <><ChevronDown className="w-4 h-4" /> View Details</>}
              </button>

              {expandedId === team.id && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Team Members</p>
                  <div className="space-y-2">
                    {fakeMembers(team).map((name) => (
                      <div key={name} className="flex items-center gap-3">
                        <div className={`w-7 h-7 ${team.color} rounded-full flex items-center justify-center shrink-0`}>
                          <span className="text-white text-[9px] font-bold">{name.substring(0, 2).toUpperCase()}</span>
                        </div>
                        <span className="text-sm text-gray-700">{name}</span>
                      </div>
                    ))}
                    {team.members > 4 && <p className="text-xs text-gray-400 pl-10">+{team.members - 4} more members</p>}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Team?</h3>
            <p className="text-sm text-gray-500 mb-6">"{teams.find((t) => t.id === deleteConfirm)?.name}" will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteTeam(deleteConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">{editingId !== null ? "Edit Team" : "Create Team"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Team Name *</label>
                <input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Backend Team" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="What does this team do?" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Team Lead</label>
                <select value={form.lead} onChange={(e) => setForm({ ...form, lead: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  {LEADS.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Members</label>
                  <input type="number" min="1" value={form.members} onChange={(e) => setForm({ ...form, members: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">Projects</label>
                  <input type="number" min="0" value={form.projects} onChange={(e) => setForm({ ...form, projects: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">Team Color</label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button key={c} onClick={() => setForm({ ...form, color: c })} className={`w-8 h-8 rounded-full ${c} flex items-center justify-center transition-transform ${form.color === c ? "scale-125 ring-2 ring-offset-2 ring-gray-400" : "hover:scale-110"}`}>
                      {form.color === c && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={!form.name.trim()} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-40">
                {editingId !== null ? "Save Changes" : "Create Team"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Teams;