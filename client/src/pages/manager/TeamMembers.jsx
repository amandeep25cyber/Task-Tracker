import { Search, X} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import TeamMemberCard from "../../components/ui/TeamMemberCard";

const initialMembers = [
  { _id: 1, name: "Emily Davis", projects:["Website Redsign","client restructue"], role: "Senior Frontend Developer", email: "emily.d@company.com", tasks: { active: 5, completed: 42 }, status: "online", avatar: "ED" },
  { _id: 2, name: "John Smith", projects:["Website Redsign","client 2.0"], role: "Backend Developer", email: "john.s@company.com", tasks: { active: 3, completed: 38 }, status: "online", avatar: "JS" },
  { _id: 3, name: "Lisa Wong", projects:["Website Redsign","client 2.0"], role: "Full Stack Developer", email: "lisa.w@company.com", tasks: { active: 4, completed: 45 }, status: "away", avatar: "LW" },
  { _id: 4, name: "David Miller", projects:["Website Redsign","client 2.0"], role: "DevOps Engineer", email: "david.m@company.com", tasks: { active: 2, completed: 31 }, status: "offline", avatar: "DM" },
  { _id: 5, name: "Sofia Reyes", projects:["Website Redsign","client 2.0"], role: "QA Engineer", email: "sofia.r@company.com", tasks: { active: 6, completed: 27 }, status: "online", avatar: "SR" },
];

const ROLES = ["Frontend Developer", "Backend Developer", "Full Stack Developer", "DevOps Engineer", "QA Engineer", "Designer", "Senior Frontend Developer", "Senior Backend Developer"];

const TeamMembers = () => {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (!menuRef.current?.contains(e.target)) setOpenMenu(null); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const uniqueRoles = ["All", ...Array.from(new Set(members.map((m) => m.role)))];

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchesSearch = !search || m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === "All" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h1><p className="text-gray-600">{members.length} members · {members.filter((m) => m.status === "online").length} online now</p></div>
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
        {filtered.map((member) => (
          <TeamMemberCard member={member} key={member._id}/>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-14 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No members match your filters</p>
        </div>
      )}
    </div>
  );
}

export default TeamMembers