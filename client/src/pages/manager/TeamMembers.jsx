import { Mail, MessageSquare, MoreVertical, Search, X, Plus, CheckCircle2, Edit2, UserMinus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const initialMembers = [
  { id: 1, name: "Emily Davis", role: "Senior Frontend Developer", email: "emily.d@company.com", tasks: { active: 5, completed: 42 }, status: "online", avatar: "ED" },
  { id: 2, name: "John Smith", role: "Backend Developer", email: "john.s@company.com", tasks: { active: 3, completed: 38 }, status: "online", avatar: "JS" },
  { id: 3, name: "Lisa Wong", role: "Full Stack Developer", email: "lisa.w@company.com", tasks: { active: 4, completed: 45 }, status: "away", avatar: "LW" },
  { id: 4, name: "David Miller", role: "DevOps Engineer", email: "david.m@company.com", tasks: { active: 2, completed: 31 }, status: "offline", avatar: "DM" },
  { id: 5, name: "Sofia Reyes", role: "QA Engineer", email: "sofia.r@company.com", tasks: { active: 6, completed: 27 }, status: "online", avatar: "SR" },
];

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "QA Engineer", "Designer", "Senior Frontend Developer", "Senior Backend Developer"];

const STATUS_DOT = { online: "bg-emerald-500", away: "bg-amber-400", offline: "bg-gray-300" };

const DEFAULT_FORM = { name: "", role: "Frontend Developer", email: "" };

const TeamMembers = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [formError, setFormError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [removeConfirm, setRemoveConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!menuRef.current?.contains(e.target)) setOpenMenu(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const uniqueRoles = ["All", ...Array.from(new Set(members.map((m) => m.role)))];

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch = !search || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "All" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openAdd = () => { setForm(DEFAULT_FORM); setEditingId(null); setFormError(""); setShowModal(true); };
  const openEdit = (m) => {
    setForm({ name: m.name, role: m.role, email: m.email });
    setEditingId(m.id); setFormError(""); setShowModal(true); setOpenMenu(null);
  };

  const save = () => {
    if (!form.name.trim() || !form.email.trim()) { setFormError("Name and email are required."); return; }
    if (!form.email.includes("@")) { setFormError("Enter a valid email address."); return; }
    if (editingId !== null) {
      setMembers((p) => p.map((m) => m.id === editingId ? { ...m, name: form.name, role: form.role, email: form.email, avatar: form.name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase() } : m));
      showToast("Member updated");
    } else {
      const newMember = { id: Date.now(), name: form.name, role: form.role, email: form.email, tasks: { active: 0, completed: 0 }, status: "offline", avatar: form.name.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase() };
      setMembers((p) => [...p, newMember]);
      showToast("Member added to team");
    }
    setShowModal(false);
  };

  const removeMember = (id) => { setMembers((p) => p.filter((m) => m.id !== id)); setRemoveConfirm(null); showToast("Member removed"); };

  const avatarColors = ["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500", "bg-teal-500"];

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h1><p className="text-gray-600">{members.length} members · {members.filter((m) => m.status === "online").length} online now</p></div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search members..." className="pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-56" />
          {search && <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"><X className="w-3.5 h-3.5" /></button>}
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {uniqueRoles.slice(0, 5).map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${roleFilter === r ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}>{r}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((member, idx) => (
          <div key={member.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-12 h-12 ${avatarColors[idx % avatarColors.length]} rounded-xl flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{member.avatar}</span>
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 ${STATUS_DOT[member.status]} rounded-full border-2 border-white`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{member.name}</h3>
                  <p className="text-xs text-gray-500">{member.role}</p>
                </div>
              </div>
              <div className="relative" ref={openMenu === member.id ? menuRef : undefined}>
                <button onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
                {openMenu === member.id && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-20">
                    <button onClick={() => openEdit(member)} className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"><Edit2 className="w-4 h-4" /> Edit</button>
                    <div className="my-1 border-t border-gray-100" />
                    <button onClick={() => { setRemoveConfirm(member.id); setOpenMenu(null); }} className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"><UserMinus className="w-4 h-4" /> Remove</button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{member.tasks.active}</p>
                <p className="text-xs text-gray-500">Active Tasks</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-lg font-bold text-gray-900">{member.tasks.completed}</p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate("/manager/chat")}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat
              </button>
              <a
                href={`mailto:${member.email}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-xs font-medium text-gray-700 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No members match your filters</p>
        </div>
      )}

      {/* Remove confirm */}
      {removeConfirm !== null && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Remove Member?</h3>
            <p className="text-sm text-gray-500 mb-6">"{members.find((m) => m.id === removeConfirm)?.name}" will be removed from the team.</p>
            <div className="flex gap-3">
              <button onClick={() => setRemoveConfirm(null)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={() => removeMember(removeConfirm)} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">{editingId !== null ? "Edit Member" : "Add Member"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            {formError && <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{formError}</div>}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Full Name *</label>
                <input autoFocus value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Alex Johnson" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="alex@company.com" className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1.5">Role</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white">
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={save} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">
                {editingId !== null ? "Save Changes" : "Add Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamMembers