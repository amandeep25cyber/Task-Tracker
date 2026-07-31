import { Card } from "../../components/ui/Card";
import { Mail, MessageSquare, MoreVertical } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Emily Davis",
    role: "Senior Frontend Developer",
    email: "emily.d@company.com",
    tasks: { active: 5, completed: 42 },
    status: "online",
    avatar: "ED",
  },
  {
    id: 2,
    name: "John Smith",
    role: "Backend Developer",
    email: "john.s@company.com",
    tasks: { active: 3, completed: 38 },
    status: "online",
    avatar: "JS",
  },
  {
    id: 3,
    name: "Lisa Wong",
    role: "Full Stack Developer",
    email: "lisa.w@company.com",
    tasks: { active: 4, completed: 45 },
    status: "away",
    avatar: "LW",
  },
  {
    id: 4,
    name: "David Miller",
    role: "UI/UX Designer",
    email: "david.m@company.com",
    tasks: { active: 2, completed: 31 },
    status: "offline",
    avatar: "DM",
  },
];

const TeamMembers = ()=> {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Team Members</h1>
        <p className="text-gray-600">View and manage your team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-medium">{member.avatar}</span>
                  </div>
                  <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                    member.status === "online" ? "bg-green-500" :
                    member.status === "away" ? "bg-yellow-500" :
                    "bg-gray-400"
                  }`}></span>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <h3 className="font-semibold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{member.role}</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-900">{member.tasks.active}</p>
                  <p className="text-xs text-blue-700 mt-1">Active</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-2xl font-bold text-green-900">{member.tasks.completed}</p>
                  <p className="text-xs text-green-700 mt-1">Completed</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm">
                  <MessageSquare className="w-4 h-4" />
                  Chat
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TeamMembers;