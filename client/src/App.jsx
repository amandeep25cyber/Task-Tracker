import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardRedirect from "./pages/DashboardRedirect";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeeDashboard from "./pages/member/EmployeeDashboard";

const App = () => {
  const role = "manager";

  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardLayout role={role}/>}>
          <Route index element={<DashboardRedirect role={role}/>} />

          <Route
            path="admin"
            element={
              role === "admin" ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/unauthorized" />
              )
            }
          />

          <Route
            path="manager"
            element={
              role === "manager" ? (
                <ManagerDashboard />
              ) : (
                <Navigate to="/unauthorized" />
              )
            }
          />

          <Route
            path="employee"
            element={
              role === "employee" ? (
                <EmployeeDashboard />
              ) : (
                <Navigate to="/unauthorized" />
              )
            }
          />
        </Route>
        
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
