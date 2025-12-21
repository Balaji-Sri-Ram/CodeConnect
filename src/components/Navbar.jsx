import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, LogOut, User, UserCircle, ChevronDown, Trophy, Building2, LayoutDashboard, Users, Moon, Sun, Monitor, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { NotificationBell } from "./NotificationBell";
import api from '@/api/client';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "./ThemeProvider";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      setIsLoggedIn(!!token);
      setUserRole(role);

      if (token && (role === 'student' || role === 'company')) {
        // Fetch profile for avatar
        try {
          const { data } = await api.get('/profile/me');
          setProfile(data);
        } catch (e) {
          console.error("Failed to fetch profile for navbar", e);
        }
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUserRole(null);
    setProfile(null);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              CodeConnect
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* 
                   Student View: Bell + Avatar Dropdown. 
                */}
                {userRole === 'student' && (
                  <>
                    <NotificationBell />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer p-0 hover:bg-transparent">
                          <Avatar>
                            <AvatarImage src={profile?.avatar_url} alt="Profile" />
                            <AvatarFallback className="bg-primary/20 text-primary font-bold">
                              {profile?.full_name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel className="font-normal">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                            <p className="text-xs leading-none text-muted-foreground">{profile?.user?.email || "Student Account"}</p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/leaderboard")}>
                          <Trophy className="mr-2 h-4 w-4" />
                          Leaderboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/companies")}>
                          <Building2 className="mr-2 h-4 w-4" />
                          Companies
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            {theme === 'light' ? <Sun className="mr-2 h-4 w-4" /> :
                              theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> :
                                <Monitor className="mr-2 h-4 w-4" />}
                            Appearance
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => setTheme("system")}>
                                <Monitor className="mr-2 h-4 w-4" />
                                System Default
                                {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="mr-2 h-4 w-4" />
                                Light
                                {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="mr-2 h-4 w-4" />
                                Dark
                                {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => navigate("/profile")}>
                          <UserCircle className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}

                {/* 
                   Company View: Avatar Dropdown ONLY (No Bell).
                   Items: Dashboard, View Talents, Profile, Logout.
                */}
                {userRole === 'company' && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full cursor-pointer p-0 hover:bg-transparent">
                        <Avatar>
                          <AvatarImage src={profile?.avatar_url} alt="Profile" />
                          <AvatarFallback className="bg-primary/20 text-primary font-bold">
                            {profile?.full_name?.charAt(0) || "C"}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{profile?.full_name || "Company"}</p>
                          <p className="text-xs leading-none text-muted-foreground">{profile?.user?.email || "Company Account"}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/leaderboard")}> {/* Updated to point to correct route */}
                        <Users className="mr-2 h-4 w-4" />
                        View Talents
                      </DropdownMenuItem>
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          {theme === 'light' ? <Sun className="mr-2 h-4 w-4" /> :
                            theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> :
                              <Monitor className="mr-2 h-4 w-4" />}
                          Appearance
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="w-48 ml-2">
                            <DropdownMenuItem onClick={() => setTheme("system")}>
                              <Monitor className="mr-2 h-4 w-4" />
                              System Default
                              {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("light")}>
                              <Sun className="mr-2 h-4 w-4" />
                              Light
                              {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme("dark")}>
                              <Moon className="mr-2 h-4 w-4" />
                              Dark
                              {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuItem onClick={() => navigate("/company/profile")}>
                        <UserCircle className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Login
                </Button>
                <Button variant="hero" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

