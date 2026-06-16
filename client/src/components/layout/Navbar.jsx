import { Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogout } from "../../services/auth.services";
import { useDispatch } from "react-redux";
import { logout } from "../../store/features/authSlice";
import { toast } from "react-toastify";

const Navbar=({ role })=> {
  const [showDropdown, setShowDropdown] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async()=>{
    try {
      const res = await userLogout();
      toast.success(res.data.message)
      dispatch(logout());
      
    } catch (error) {
      navigate('/');
      toast.error(error.response?.data?.message)
    }
  }

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, people..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex items-center gap-4 ml-6">
        <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 hover:bg-gray-50 p-2 pr-3 rounded-xl transition-colors"
          >
            <div className="w-8 h-8 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {role === "admin" ? "AD" : role === "manager" ? "PM" : "TM"}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {role === "admin" ? "Admin User" : role === "manager" ? "Project Manager" : "Team Member"}
              </p>
              <p className="text-xs text-gray-500">
                {role === "admin" ? "admin@company.com" : role === "manager" ? "manager@company.com" : "member@company.com"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <Link
                to={role === "member" ? "/member/profile" : `/${role}/settings`}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Profile Settings
              </Link>
              <Link
                to="/sign-in"
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
