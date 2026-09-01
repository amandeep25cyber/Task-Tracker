import { KanbanBoard } from "../../components/ui/KanbanBoard";
import { Filter, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserTasks, updateLogtimeAndStatus } from "../../services/member.services.js";

const MyTasks = ()=> {
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(()=>{
    getUserTasksData();
  },[])

  const getUserTasksData = async()=>{
    try {
      const tasks = await getUserTasks();
      setTodo(tasks?.data?.todo);
      setInProgress(tasks?.data?.inProgress);
      setDone(tasks?.data?.done);
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  const getAll = () => [
    ...todo.map((t) => ({ ...t, col: "todo" })),
    ...inProgress.map((t) => ({ ...t, col: "inProgress" })),
    ...done.map((t) => ({ ...t, col: "done" })),
  ];

  const handleTaskMove = async(taskId, toColumn) => {
    const all = getAll();
    const found = all.find((t) => t._id === taskId);
    if (!found) return;
    const { col: fromCol, ...task } = found;

    console.log(task);

    const remove = (arr) => arr.filter((t) => t._id !== taskId);
    const add = (arr) => [...arr, task];

    try {
      const status = toColumn ==="inProgress" ? "in-progress": toColumn;
      const updatedTask = await updateLogtimeAndStatus({hours:"",status,taskId})
      console.log(updatedTask)
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }

    if (fromCol === "todo") setTodo(remove);
    else if (fromCol === "inProgress") setInProgress(remove); 
    else setDone(remove);

    if (toColumn === "todo") setTodo(add); 
    else if (toColumn === "inProgress") setInProgress(add); 
    else setDone(add);

  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Tasks</h1>
          <p className="text-gray-600">{todo.length + inProgress.length + done.length} tasks · {done.length} completed</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-700">
            <Calendar className="w-4 h-4" />
            This Week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">To Do</p>
          <p className="text-3xl font-bold text-gray-900">{todo.length}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">In Progress</p>
          <p className="text-3xl font-bold text-blue-700">{inProgress.length}</p>
        </div>
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">Completed</p>
          <p className="text-3xl font-bold text-emerald-700">{done.length}</p>
        </div>
      </div>

      <KanbanBoard
        todoTasks={todo}
        inProgressTasks={inProgress}
        doneTasks={done}
        onTaskMove={handleTaskMove}
      />
    </div>
  );
}

export default MyTasks;