import React, { useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardRedirect from "./pages/DashboardRedirect";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import EmployeeDashboard from "./pages/member/EmployeeDashboard";
import { ToastContainer } from "react-toastify"
import { getCurrentUser } from "./services/auth.services.js"
import { useDispatch, useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
  const dispatch = useDispatch();

  const {isLoggedIn,user} = useSelector(state=>state.auth);

  const role = user?.role;
  const navigate = useNavigate();
  
  useEffect(() => {
    getCurrentUser(dispatch);
    if(isLoggedIn){
      navigate('/');
    }
  }, []);

  

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<ProtectedRoute />}>
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
            path="member"
            element={
              role === "member" ? (
                <EmployeeDashboard />
              ) : (
                <Navigate to="/unauthorized" />
              )
            }
          />
        </Route>
       </Route>
        
        <Route path="/sign-in" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
      </Routes>
    </>
  );
};

export default App;
