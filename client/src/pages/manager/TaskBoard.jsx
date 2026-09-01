import { KanbanBoard } from "../../components/ui/KanbanBoard";
import { Plus, Filter, X, ChevronDown, Projector } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createNewTaskByManager, getAllTasksForManager, getAllUsersOfOrg, getManagerProjects, updateTaskStatus } from "../../services/manager.services";

const ASSIGNEES = ["Emily Davis", "John Smith", "Lisa Wong", "David Miller", "Mike Chen"];
const PRIORITIES = ["low", "medium", "high"];

const DEFAULT_TASK = { 
  title: "", 
  description: "", 
  assignee: "", 
  priority: "low", 
  tags: "", 
  column: "todo", 
  project: "", 
  deadline: "" 
}

const TaskBoard = ()=> {
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);

  const [showNewTask, setShowNewTask] = useState(false);
  const [defaultColumn, setDefaultColumn] = useState("todo");
  const [showFilter, setShowFilter] = useState(false);

  const [newTask, setNewTask] = useState(DEFAULT_TASK);

  const [filterPriority, setFilterPriority] = useState("All");
  const [filterAssignee, setFilterAssignee] = useState("All");

  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(()=>{
    getAllTasksData();
    getProjectsData();
    getTeamMemberData();
  },[])

  const getAll = () => [
    ...todo.map((t) => ({ ...t, col: "todo" })),
    ...inProgress.map((t) => ({ ...t, col: "inProgress" })),
    ...done.map((t) => ({ ...t, col: "done" })),
  ];

  const applyFilter = (tasks) =>
    tasks.filter((t) => {
      const matchPriority = filterPriority === "All" || t.priority === filterPriority;
      const matchAssignee = filterAssignee === "All" || t.assignedTo?._id === filterAssignee;
      return matchPriority && matchAssignee;
    });

  const getAllTasksData = async() =>{
    try {
      const result = await getAllTasksForManager();
      setTodo(result?.data?.todoTasks);
      setInProgress(result?.data?.inProgressTasks)
      setDone(result?.data?.doneTasks);
    } catch (error) {
      console.log(error.response?.data?.message);
      toast.error(error.response?.data?.message);
    }
  }

  const getTeamMemberData = async() =>{
    try {
      const result = await getAllUsersOfOrg();
      setMembers(result?.data);

    } catch (error) {
      console.log(error.response?.data?.message)
      toast.error(error.response?.data?.message)
    }
  }

  const handleTaskMove = (taskId, toColumn) => {
    const all = getAll();
    const task = all.find((t) => t._id === taskId);
    if (!task) return;
    const { col: fromCol, ...cleanTask } = task;

    const remove = (arr) => arr.filter((t) => t._id !== taskId);
    const add = (arr) => [...arr, cleanTask];

    //function call of status updation
    updateTaskStatusByManager(toColumn,taskId);

    if (fromCol === "todo") setTodo(remove);
    else if (fromCol === "inProgress") setInProgress(remove);
    else setDone(remove);

    if (toColumn === "todo") setTodo(add);
    else if (toColumn === "inProgress") setInProgress(add);
    else setDone(add);
  };

  const updateTaskStatusByManager = async(toColumn,taskId) =>{
    try {
      const status = toColumn ==="inProgress" ? "in-progress": toColumn;
      await updateTaskStatus(status,taskId);
      
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  const getProjectsData = async() =>{
    try {
      const result = await getManagerProjects();
      setProjects(result?.data);

    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  const openAddTask = (col) => {
    setDefaultColumn(col);
    setNewTask((n) => ({ ...n, column: col }));
    setShowNewTask(true);
  };

  const addTask = async() => {
    if (!newTask.title.trim() || !newTask.project.trim()) return;
    try {
      const result = await createNewTaskByManager({
        title: newTask?.title,
        description: newTask?.description,
        priority: newTask?.priority,
        assignedTo: newTask?.assignee,
        tags: newTask?.tags,
        status: newTask?.column === "inProgress" ? "in-progress": newTask?.column,
        project: newTask?.project,
        deadline: newTask?.deadline
      });

      if(newTask?.column==="todo"){
        setTodo((prev)=>[...prev,result.data]);
      }else if(newTask?.column==="done"){
        setDone((prev)=>[...prev,result.data]);
      }else{
        setInProgress((prev)=>[...prev,result.data]);
      }

      toast.success("Task created!")

    } catch (error) {
      console.log(error.response?.data?.message)
      toast.error(error.response?.data?.message)
    }
    setNewTask(DEFAULT_TASK);
    setShowNewTask(false);
  };

  const isFiltered = filterPriority !== "All" || filterAssignee !== "All";
  const totalTasks = todo.length + inProgress.length + done.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Task Board</h1>
          <p className="text-gray-600">{totalTasks} tasks · {done.length} completed</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={()=> setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors text-sm select-none cursor-pointer font-medium ${
                isFiltered ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filter
              {isFiltered && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 p-4 z-20 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Priority</label>
                  <div className="flex flex-wrap gap-1.5">
                    {["All", "low", "medium", "high"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilterPriority(p)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                          filterPriority === p ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Assignee</label>
                  <select
                    value={filterAssignee}
                    onChange={(e) => setFilterAssignee(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="All">All members</option>
                    {members.map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}
                  </select>
                </div>
                {isFiltered && (
                  <button
                    onClick={() => { setFilterPriority("All"); setFilterAssignee("All"); }}
                    className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium text-center"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => { setShowNewTask(true); setNewTask((n) => ({ ...n, column: "todo" })); }}
            className="flex items-center select-none cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      <KanbanBoard
        todoTasks={applyFilter(todo)}
        inProgressTasks={applyFilter(inProgress)}
        doneTasks={applyFilter(done)}
        onTaskMove={handleTaskMove}
        onAddTask={openAddTask}
      />

      {isFiltered && (
        <p className="text-sm text-gray-500 text-center">
          Showing filtered results ·{" "}
          <button onClick={() => { setFilterPriority("All"); setFilterAssignee("All"); }} className="text-blue-600 hover:underline">
            Clear filters
          </button>
        </p>
      )}

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Create New Task</h3>
              <button onClick={() => setShowNewTask(false)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Title *</label>
                <input
                  autoFocus
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Column</label>
                  <select
                    value={newTask.column}
                    onChange={(e) => setNewTask({ ...newTask, column: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Assignee</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Unassigned</option>
                  {members.map((member) => <option key={member._id} value={member._id}>{member.name}</option>)}
                </select>
              </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Deadline</label>
                  <input
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  />
                </div>
              </div>
              <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1.5">Project</label>
                  <select
                    value={newTask.project}
                    onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                  >
                    <option value="">Select Project</option>
                    {projects.map((project) => <option key={project._id} value={project._id}>{project.title}</option>)}
                  </select>
                </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Tags <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                <input
                  value={newTask.tags}
                  onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                  placeholder="Frontend, API, Design"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewTask(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                disabled={!newTask.title.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskBoard;