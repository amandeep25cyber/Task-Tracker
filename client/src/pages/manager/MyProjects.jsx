import { Card } from "../../components/ui/Card";
import { Plus, Filter, Clock, Users } from "lucide-react";
import { Link } from "react-router";

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "In Progress",
    progress: 65,
    team: ["ED", "JS", "LW"],
    deadline: "May 30, 2026",
    tasks: { total: 45, completed: 29, pending: 16 },
  },
  {
    id: 2,
    name: "Mobile App Launch",
    status: "In Progress",
    progress: 40,
    team: ["JS", "LW"],
    deadline: "Jun 15, 2026",
    tasks: { total: 62, completed: 25, pending: 37 },
  },
  {
    id: 3,
    name: "API Integration",
    status: "Completed",
    progress: 100,
    team: ["MC", "DM"],
    deadline: "May 20, 2026",
    tasks: { total: 28, completed: 28, pending: 0 },
  },
];

const MyProjects = ()=> {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Projects</h1>
          <p className="text-gray-600">Manage and track your assigned projects</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <select className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>All Status</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Planning</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="p-6">
              <Link to={`/manager/project/${project.id}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      project.status === "Completed" ? "bg-green-100 text-green-700" :
                      project.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex -space-x-2">
                    {project.team.map((member, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center border-2 border-white"
                      >
                        <span className="text-white text-xs font-medium">{member}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">{project.tasks.total}</p>
                    <p className="text-xs text-gray-600 mt-1">Total</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-900">{project.tasks.completed}</p>
                    <p className="text-xs text-green-700 mt-1">Done</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-900">{project.tasks.pending}</p>
                    <p className="text-xs text-blue-700 mt-1">Pending</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  Deadline: {project.deadline}
                </div>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MyProjects;