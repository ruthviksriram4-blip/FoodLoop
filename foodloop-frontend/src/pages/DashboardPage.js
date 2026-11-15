import { Navigate } from "react-router-dom";
import DonorDashboard from "./DonorDashboard";
import NGODashboard from "./NGODashboard";
import VolunteerDashboard from "./VolunteerDashboard";
import AdminDashboard from "./AdminDashboard";

function DashboardPage() {
  const user = JSON.parse(localStorage.getItem("foodloopUser"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "DONOR") {
    return <DonorDashboard />;
  }

  if (user.role === "NGO") {
    return <NGODashboard />;
  }

  if (user.role === "VOLUNTEER") {
    return <VolunteerDashboard />;
  }

  if (user.role === "ADMIN") {
    return <AdminDashboard />;
  }

  return <Navigate to="/login" replace />;
}

export default DashboardPage;