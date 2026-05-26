import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

const DashboardLayout=()=> {

  const [role,setRole] = useState("manager");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role={role} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;