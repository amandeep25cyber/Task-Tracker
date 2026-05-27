import { Navigate } from "react-router-dom";

function DashboardRedirect({role}) {


  if(role === "admin"){
    return <Navigate to="admin" />;
  }

  if(role === "manager"){
    return <Navigate to="manager" />;
  }

  if(role === "employee"){
    return <Navigate to="employee" />
  }

  return <Navigate to="/sign-in" />;
}

export default DashboardRedirect;