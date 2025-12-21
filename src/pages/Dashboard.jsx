import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Navbar } from "@/components/Navbar";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import CompanyDashboard from "@/components/dashboard/CompanyDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token) {
        navigate("/auth");
        return;
      }

      // Optional: Verify token existence or validity with a /me call
      // For speed, just trust localStorage + API 401 interceptor (in client.js)
      setUserRole(role || "student");
      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {userRole === "student" && <StudentDashboard />}
      {userRole === "company" && <CompanyDashboard />}
      {!userRole && (
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Unable to load dashboard</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
