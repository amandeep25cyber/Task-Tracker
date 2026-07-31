import { KanbanBoard } from "../../components/ui/KanbanBoard";
import { Plus, Filter, X, ChevronDown } from "lucide-react";
import { useState } from "react";

const ASSIGNEES = ["Emily Davis", "John Smith", "Lisa Wong", "David Miller", "Mike Chen"];
const PRIORITIES = ["low", "medium", "high"];

const initialTodo = [
  { id: "1", title: "Design landing page", description: "Create mockups for the new landing page", assignee: "Emily Davis", priority: "high", tags: ["Design", "UI"] },
  { id: "2", title: "Setup CI/CD pipeline", description: "Configure automated deployment workflow", assignee: "John Smith", priority: "medium", tags: ["DevOps"] },
  { id: "3", title: "Write API documentation", assignee: "Lisa Wong", priority: "low", tags: ["Documentation"] },
];

const initialInProgress = [
  { id: "4", title: "Implement user authentication", description: "Add login and signup functionality", assignee: "John Smith", priority: "high", tags: ["Backend", "Security"] },
  { id: "5", title: "Create dashboard components", assignee: "Emily Davis", priority: "medium", tags: ["Frontend"] },
];

const initialDone = [
  { id: "6", title: "Database schema design", assignee: "Lisa Wong", priority: "high", tags: ["Database"] },
  { id: "7", title: "Setup development environment", assignee: "John Smith", priority: "medium", tags: ["Setup"] },
  { id: "8", title: "Initial project setup", assignee: "Emily Davis", priority: "low", tags: ["Setup"] },
];

const TaskBoard = ()=> {
  const [todo, setTodo] = useState(initialTodo);
  const [inProgress, setInProgress] = useState(initialInProgress);
  const [done, setDone] = useState(initialDone);

  const [showNewTask, setShowNewTask] = useState(false);
  const [defaultColumn, setDefaultColumn] = useState("todo");
  const [showFilter, setShowFilter] = useState(false);

  const [newTask, setNewTask] = useState({ title: "", description: "", assignee: "", priority: "medium", tags: "", column: "todo" });

  const [filterPriority, setFilterPriority] = useState("All");
  const [filterAssignee, setFilterAssignee] = useState("All");

  const getAll = () => [
    ...todo.map((t) => ({ ...t, col: "todo" })),
    ...inProgress.map((t) => ({ ...t, col: "inProgress" })),
    ...done.map((t) => ({ ...t, col: "done" })),
  ];

  const applyFilter = (tasks) =>
    tasks.filter((t) => {
      const matchPriority = filterPriority === "All" || t.priority === filterPriority;
      const matchAssignee = filterAssignee === "All" || t.assignee === filterAssignee;
      return matchPriority && matchAssignee;
    });

  const handleTaskMove = (taskId, toColumn) => {
    const all = getAll();
    const task = all.find((t) => t.id === taskId);
    if (!task) return;
    const { col: fromCol, ...cleanTask } = task;

    const remove = (arr) => arr.filter((t) => t.id !== taskId);
    const add = (arr) => [...arr, cleanTask];

    if (fromCol === "todo") setTodo(remove);
    else if (fromCol === "inProgress") setInProgress(remove);
    else setDone(remove);

    if (toColumn === "todo") setTodo(add);
    else if (toColumn === "inProgress") setInProgress(add);
    else setDone(add);
  };

  const openAddTask = (col) => {
    setDefaultColumn(col);
    setNewTask((n) => ({ ...n, column: col }));
    setShowNewTask(true);
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description || undefined,
      assignee: newTask.assignee || undefined,
      priority: newTask.priority,
      tags: newTask.tags ? newTask.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };
    if (newTask.column === "todo") setTodo((p) => [...p, task]);
    else if (newTask.column === "inProgress") setInProgress((p) => [...p, task]);
    else setDone((p) => [...p, task]);
    setNewTask({ title: "", description: "", assignee: "", priority: "medium", tags: "", column: "todo" });
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
              onClick={() => setShowFilter(!showFilter)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors text-sm font-medium ${
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
                    {ASSIGNEES.map((a) => <option key={a}>{a}</option>)}
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
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium"
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
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">Assignee</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="">Unassigned</option>
                  {ASSIGNEES.map((a) => <option key={a}>{a}</option>)}
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