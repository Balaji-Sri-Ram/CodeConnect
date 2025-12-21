import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "@/api/client";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CompanyChallenges from "./pages/CompanyChallenges";
import AllProblems from "./pages/AllProblems";
import StudentProfile from "./pages/StudentProfile";
import CompanyProfile from "./pages/CompanyProfile";
import Compiler from "./pages/Compiler";
import Leaderboard from "./pages/Leaderboard";
import DeveloperProfile from "./pages/DeveloperProfile";
import PublicCompanyProfile from "./pages/PublicCompanyProfile";
import Companies from "./pages/Companies";
import NotFound from "./pages/NotFound";

const ProfileRouter = () => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth');
        return;
      }

      try {
        const { data } = await api.get('/profile/me');
        // Backend returns profile object which contains user object with role
        // Or sometimes backend structure varies, let's verify profile/me response from profiles.js
        // profiles.js line 11: populate('user', ['email', 'role'])
        // So data.user.role is the key.
        setUserRole(data.user?.role || 'student');
      } catch (error) {
        console.error("Profile check failed", error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    checkRole();
  }, [navigate]);

  if (loading) return null;

  return userRole === "company" ? <CompanyProfile /> : <StudentProfile />;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company-challenges" element={<CompanyChallenges />} />
          <Route path="/all-problems" element={<AllProblems />} />
          <Route path="/compiler" element={<Compiler />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/developer/:id" element={<DeveloperProfile />} />
          <Route path="/profile" element={<ProfileRouter />} />
          <Route path="/company/profile" element={<CompanyProfile />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/company/:id" element={<PublicCompanyProfile />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
