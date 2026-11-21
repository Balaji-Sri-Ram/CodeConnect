import { useLocation, useNavigate } from "react-router-dom";
import { LayoutGrid, Trophy, Building2, User } from "lucide-react";

export const MobileBottomNav = ({ isLoggedIn, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on compiler view so mobile editor viewport is clean
  if (location.pathname === "/compiler") {
    return null;
  }

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
      isActive: location.pathname === "/dashboard",
      authRequired: true,
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      path: "/leaderboard",
      isActive:
        location.pathname === "/leaderboard" ||
        location.pathname.startsWith("/developer/"),
      authRequired: false,
    },
    {
      id: "companies",
      label: "Companies",
      icon: Building2,
      path: "/companies",
      isActive:
        location.pathname === "/companies" ||
        (location.pathname.startsWith("/company/") &&
          location.pathname !== "/company/profile"),
      authRequired: false,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: userRole === "company" ? "/company/profile" : "/profile",
      isActive:
        location.pathname === "/profile" ||
        location.pathname === "/company/profile",
      authRequired: true,
    },
  ];

  const handleNavClick = (item) => {
    if (item.authRequired && !isLoggedIn) {
      navigate("/auth");
      return;
    }

    if (item.isActive) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    navigate(item.path);
  };

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 dark:bg-zinc-950/95 backdrop-blur-md border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] pb-[max(env(safe-area-inset-bottom),8px)] pt-1 px-2 select-none"
    >
      <div className="grid grid-cols-4 items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer group active:scale-90 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground/75 hover:text-foreground"
              }`}
            >
              {/* Active indicator top bar */}
              <div
                className={`w-6 h-1 rounded-full mb-1 transition-all duration-300 ${
                  active
                    ? "bg-primary scale-100 opacity-100"
                    : "bg-transparent scale-0 opacity-0"
                }`}
              />

              {/* Icon Container with subtle active pill */}
              <div
                className={`p-1 rounded-lg transition-transform duration-200 ${
                  active ? "scale-110" : "group-hover:scale-105"
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    active ? "stroke-[2.5px]" : "stroke-[1.8px]"
                  }`}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] mt-0.5 tracking-tight transition-all duration-200 ${
                  active
                    ? "font-bold text-primary"
                    : "font-medium text-muted-foreground/80"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
export default MobileBottomNav;
