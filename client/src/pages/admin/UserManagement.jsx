import { Card } from "../../components/ui/Card";
import { Table } from "../../components/ui/Table";
import { Search, Plus, MoreVertical, Edit2, Trash2, Ban } from "lucide-react";
import { useState } from "react";

const userData = [
  { id: 1, name: "Sarah Johnson", email: "sarah.j@company.com", role: "Admin", status: "Active", lastActive: "2 hours ago" },
  { id: 2, name: "Mike Chen", email: "mike.c@company.com", role: "Project Manager", status: "Active", lastActive: "1 hour ago" },
  { id: 3, name: "Emily Davis", email: "emily.d@company.com", role: "Team Member", status: "Active", lastActive: "5 minutes ago" },
  { id: 4, name: "John Smith", email: "john.s@company.com", role: "Team Member", status: "Inactive", lastActive: "3 days ago" },
  { id: 5, name: "Lisa Wong", email: "lisa.w@company.com", role: "Project Manager", status: "Active", lastActive: "30 minutes ago" },
  { id: 6, name: "David Miller", email: "david.m@company.com", role: "Team Member", status: "Active", lastActive: "1 day ago" },
];

const UserManagement = ()=> {
  const [showActions, setShowActions] = useState(null);

  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">{value.substring(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: "role",
      cell: (value) => (
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
          value === "Admin" ? "bg-purple-100 text-purple-700" :
          value === "Project Manager" ? "bg-blue-100 text-blue-700" :
          "bg-gray-100 text-gray-700"
        }`}>
          {value}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      cell: (value) => (
        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
          value === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
        }`}>
          {value}
        </span>
      ),
    },
    {
      header: "Last Active",
      accessor: "lastActive",
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (value) => (
        <div className="relative">
          <button
            onClick={() => setShowActions(showActions === value ? null : value)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          {showActions === value && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Edit User
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <Ban className="w-4 h-4" /> Block User
              </button>
              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Delete User
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all users and their permissions</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Roles</option>
              <option>Admin</option>
              <option>Project Manager</option>
              <option>Team Member</option>
            </select>
            <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </div>
        <Table columns={columns} data={userData} />
      </Card>
    </div>
  );
}

export default UserManagement;