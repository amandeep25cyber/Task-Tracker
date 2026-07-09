import { Card, StatCard } from "../../components/ui/Card";
import { FolderKanban, Clock, CheckCircle2, AlertCircle, Plus, MoreVertical } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";
import { getProjectsStats } from "../../services/organisation.services";
import { useDispatch,useSelector } from "react-redux"
import { storeProjectsStats } from "../../store/features/orgSlice";

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "In Progress",
    progress: 65,
    team: ["SJ", "MC", "ED"],
    deadline: "May 30, 2026",
    tasks: { total: 45, completed: 29 },
    health: "good",
  },
  {
    id: 2,
    name: "Mobile App Launch",
    status: "In Progress",
    progress: 40,
    team: ["JS", "LW"],
    deadline: "Jun 15, 2026",
    tasks: { total: 62, completed: 25 },
    health: "warning",
  },
  {
    id: 3,
    name: "API Integration",
    status: "Completed",
    progress: 100,
    team: ["MC", "DM"],
    deadline: "May 20, 2026",
    tasks: { total: 28, completed: 28 },
    health: "good",
  },
  {
    id: 4,
    name: "Security Audit",
    status: "Planning",
    progress: 15,
    team: ["SJ", "ED", "JS"],
    deadline: "Jul 1, 2026",
    tasks: { total: 35, completed: 5 },
    health: "critical",
  },
];

const Projects = ()=> {

  const dispatch = useDispatch();
  const { projectsStats } = useSelector(state=>state.organisation)

  useEffect(()=>{
    //calls the services
    handleProjectsData();
  },[])

  const handleProjectsData = async()=>{
    try {
      const statsData = await getProjectsStats();
      
      dispatch(storeProjectsStats(statsData?.data))

    } catch (error) {
      console.log(error)
    }
  }

  const inProgressPercentage = (projectsStats?.inProgressProjects)/(projectsStats?.allProjects)*100;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">All Projects</h1>
          <p className="text-gray-600">Monitor and manage all company projects</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={projectsStats ? projectsStats?.allProjects : "0"}
          change={`+${projectsStats ? projectsStats?.projectsCreatedThisMonth : "0"} this month`}
          icon={<FolderKanban className="w-6 h-6" />}
          trend={projectsStats && projectsStats?.projectsCreatedThisMonth>0 ?"up" : "neutral"}
        />
        <StatCard
          title="In Progress"
          value={projectsStats ? projectsStats?.inProgressProjects : "0"}
          change={`${inProgressPercentage?inProgressPercentage:"0"}% of total`}
          icon={<Clock className="w-6 h-6" />}
          trend={inProgressPercentage>60 ? "down" : "neutral"}
        />
        <StatCard
          title="Completed"
          value={projectsStats ? projectsStats?.completedProjects : "0"}
          change={`+${projectsStats ? projectsStats?.completedThisWeek : "0"} this week`}
          icon={<CheckCircle2 className="w-6 h-6" />}
          trend={projectsStats && projectsStats?.completedThisWeek>0 ?"up" : "neutral"}
        />
        <StatCard
          title="At Risk"
          value={projectsStats ? projectsStats?.atRiskProjects : "0"}
          change={projectsStats && projectsStats?.atRiskProjects == 0 ? "No Worry": "Needs attention"}
          icon={<AlertCircle className="w-6 h-6" />}
          trend={projectsStats && projectsStats?.atRiskProjects == 0 ? "up": "down"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card key={project.id}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Link to={`/admin/project/${project.id}`} className="hover:text-blue-600">
                    <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
                  </Link>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      project.status === "Completed" ? "bg-green-100 text-green-700" :
                      project.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {project.status}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      project.health === "good" ? "bg-green-500" :
                      project.health === "warning" ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}></span>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                </button>
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

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
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
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">{project.tasks.completed}</span>/{project.tasks.total} tasks
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {project.deadline}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Projects;