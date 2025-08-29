import { Link, useLocation } from "react-router-dom";
import { HomeIcon, UsersIcon, BellIcon, Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const navItems = [
    { path: "/", icon: HomeIcon, label: "Home" },
    { path: "/friends", icon: UsersIcon, label: "Friends" },
    { path: "/notifications", icon: BellIcon, label: "Notifications" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ path, icon: IconComponent, label }) => {
          const Icon = IconComponent;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPath === path 
                  ? "text-primary bg-primary/10" 
                  : "text-base-content/70 hover:text-primary hover:bg-primary/5"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
        
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-base-content/70 hover:text-primary hover:bg-primary/5"
          title={isDarkMode ? "Light Mode" : "Dark Mode"}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="text-xs font-medium">
            {isDarkMode ? "Light" : "Dark"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MobileBottomNav;
