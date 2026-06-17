import { Card } from "../../components/ui/Card";
import { Users, Plus } from "lucide-react";

const teams = [
  {
    id: 1,
    name: "Development Team",
    members: 12,
    projects: 5,
    lead: "Mike Chen",
    description: "Frontend and backend development",
  },
  {
    id: 2,
    name: "Design Team",
    members: 6,
    projects: 8,
    lead: "Sarah Johnson",
    description: "UI/UX and visual design",
  },
  {
    id: 3,
    name: "Marketing Team",
    members: 8,
    projects: 3,
    lead: "Emily Davis",
    description: "Digital marketing and content",
  },
  {
    id: 4,
    name: "QA Team",
    members: 5,
    projects: 7,
    lead: "John Smith",
    description: "Quality assurance and testing",
  },
];

const Teams = ()=> {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Teams</h1>
          <p className="text-gray-600">Manage teams and their members</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <Card key={team.id}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{team.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{team.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Team Lead</span>
                  <span className="font-medium text-gray-900">{team.lead}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Members</span>
                  <span className="font-medium text-gray-900">{team.members}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-medium text-gray-900">{team.projects}</span>
                </div>
              </div>
              <button className="w-full py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                View Details
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Teams;