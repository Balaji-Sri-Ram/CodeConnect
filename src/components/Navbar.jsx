import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, LogOut, User, ChevronDown, Trophy, Building, LayoutGrid, Users, Moon, Sun, Monitor, Check, Menu, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const handleLogoClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 text-xl font-bold">
            <Code2 className="h-6 w-6 text-primary" />
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              CodeConnect
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Desktop View */}
                <div className="hidden md:flex items-center gap-4">
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
                            <LayoutGrid className="mr-2 h-4 w-4 text-sky-500" />
                            Dashboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/leaderboard")}>
                            <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
                            Leaderboard
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate("/companies")}>
                            <Building className="mr-2 h-4 w-4 text-purple-500" />
                            Companies
                          </DropdownMenuItem>
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                              {theme === 'light' ? <Sun className="mr-2 h-4 w-4 text-orange-500" /> :
                                theme === 'dark' ? <Moon className="mr-2 h-4 w-4 text-blue-500" /> :
                                  <Monitor className="mr-2 h-4 w-4 text-blue-700" />}
                              Appearance
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                  <Monitor className="mr-2 h-4 w-4 text-blue-700" />
                                  System Default
                                  {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                  <Sun className="mr-2 h-4 w-4 text-orange-500" />
                                  Light
                                  {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                  <Moon className="mr-2 h-4 w-4 text-blue-500" />
                                  Dark
                                  {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                                </DropdownMenuItem>
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                          <DropdownMenuItem onClick={() => navigate("/profile")}>
                            <User className="mr-2 h-4 w-4 text-emerald-500" />
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
                          <LayoutGrid className="mr-2 h-4 w-4 text-sky-500" />
                          Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/leaderboard")}> {/* Updated to point to correct route */}
                          <Users className="mr-2 h-4 w-4 text-indigo-500" />
                          View Talents
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            {theme === 'light' ? <Sun className="mr-2 h-4 w-4 text-orange-500" /> :
                              theme === 'dark' ? <Moon className="mr-2 h-4 w-4 text-blue-500" /> :
                                <Monitor className="mr-2 h-4 w-4 text-blue-700" />}
                            Appearance
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="w-48 ml-2">
                              <DropdownMenuItem onClick={() => setTheme("system")}>
                                <Monitor className="mr-2 h-4 w-4 text-blue-700" />
                                System Default
                                {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setTheme("light")}>
                                <Sun className="mr-2 h-4 w-4 text-orange-500" />
                                Light
                                {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setTheme("dark")}>
                                <Moon className="mr-2 h-4 w-4 text-blue-500" />
                                Dark
                                {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem onClick={() => navigate("/company/profile")}>
                          <User className="mr-2 h-4 w-4 text-emerald-500" />
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
                </div>

                {/* Mobile Menu Toggle */}
                <div className="md:hidden flex items-center gap-2">
                  {userRole === 'student' && <NotificationBell />}
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-4">
                  <Button variant="ghost" onClick={() => navigate("/auth")}>
                    Login
                  </Button>
                  <Button variant="hero" onClick={() => navigate("/auth")}>
                    Get Started
                  </Button>
                </div>
                {/* Mobile Menu Toggle for Visitors */}
                <div className="md:hidden">
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[100] bg-background/100 dark:bg-zinc-950 animate-in slide-in-from-top-0 fade-in duration-200 flex flex-col h-[100dvh]">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl" onClick={handleLogoClick}>
              <Code2 className="h-6 w-6 text-primary" />
              <span>CodeConnect</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col p-4 space-y-4 overflow-y-auto flex-1">
            {isLoggedIn ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={profile?.avatar_url} alt="Profile" />
                    <AvatarFallback className="text-lg font-bold text-primary">{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <p className="font-semibold truncate">{profile?.full_name}</p>
                    <p className="text-sm text-muted-foreground truncate">{profile?.user?.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="ghost" size="lg" className="w-full justify-start text-base" onClick={() => { navigate("/dashboard"); setIsMobileMenuOpen(false); }}>
                    <LayoutGrid className="mr-3 h-5 w-5 text-sky-500" /> Dashboard
                  </Button>
                  <Button variant="ghost" size="lg" className="w-full justify-start text-base" onClick={() => { navigate(userRole === 'company' ? "/leaderboard" : "/leaderboard"); setIsMobileMenuOpen(false); }}>
                    {userRole === 'company' ? <Users className="mr-3 h-5 w-5 text-indigo-500" /> : <Trophy className="mr-3 h-5 w-5 text-yellow-500" />}
                    {userRole === 'company' ? "View Talents" : "Leaderboard"}
                  </Button>
                  {userRole === 'student' && (
                    <Button variant="ghost" size="lg" className="w-full justify-start text-base" onClick={() => { navigate("/companies"); setIsMobileMenuOpen(false); }}>
                      <Building className="mr-3 h-5 w-5 text-purple-500" /> Companies
                    </Button>
                  )}
                  <Button variant="ghost" size="lg" className="w-full justify-start text-base" onClick={() => { navigate(userRole === 'company' ? "/company/profile" : "/profile"); setIsMobileMenuOpen(false); }}>
                    <User className="mr-3 h-5 w-5 text-emerald-500" /> Profile
                  </Button>
                </div>

                <div className="pt-4 border-t border-border space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <p className="text-sm font-medium text-muted-foreground">Appearance</p>
                  </div>
                  <div className="flex gap-2 p-1 bg-muted rounded-lg">
                    <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" className="flex-1" onClick={() => setTheme("light")}>
                      <Sun className="h-4 w-4 mr-2 text-orange-500" /> Light
                    </Button>
                    <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" className="flex-1" onClick={() => setTheme("dark")}>
                      <Moon className="h-4 w-4 mr-2 text-blue-500" /> Dark
                    </Button>
                    <Button variant={theme === 'system' ? 'secondary' : 'ghost'} size="sm" className="flex-1" onClick={() => setTheme("system")}>
                      <Monitor className="h-4 w-4 mr-2 text-blue-700" /> System
                    </Button>
                  </div>
                </div>

                <Button variant="destructive" size="lg" className="w-full justify-start mt-4" onClick={handleLogout}>
                  <LogOut className="mr-3 h-5 w-5" /> Logout
                </Button>
              </div>
            ) : (
              <div className="space-y-4 flex flex-col justify-center h-full">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Welcome!</h3>
                  <p className="text-muted-foreground">Join the community of developers.</p>
                </div>
                <Button variant="outline" size="lg" className="w-full h-12 text-base" onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}>
                  Log In
                </Button>
                <Button variant="hero" size="lg" className="w-full h-12 text-base" onClick={() => { navigate("/auth"); setIsMobileMenuOpen(false); }}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
