import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import api from "@/api/client";

// Lazy-loaded pages for code splitting — each page is loaded on demand
const Landing = lazy(() => import("./pages/Landing"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CompanyChallenges = lazy(() => import("./pages/CompanyChallenges"));
const AllProblems = lazy(() => import("./pages/AllProblems"));
const StudentProfile = lazy(() => import("./pages/StudentProfile"));
const CompanyProfile = lazy(() => import("./pages/CompanyProfile"));
const Compiler = lazy(() => import("./pages/Compiler"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const DeveloperProfile = lazy(() => import("./pages/DeveloperProfile"));
const PublicCompanyProfile = lazy(() => import("./pages/PublicCompanyProfile"));
const Companies = lazy(() => import("./pages/Companies"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal loading spinner shown while a lazy page chunk is being fetched
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  </div>
);

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes: reuse cached data instead of refetching immediately
      gcTime: 1000 * 60 * 10,   // 10 minutes cache garbage collection
      refetchOnWindowFocus: false, // Avoid burst of refetches when user switches back to browser tab
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
