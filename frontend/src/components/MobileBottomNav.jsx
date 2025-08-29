import { Link, useLocation } from "react-router-dom";
import { HomeIcon, UsersIcon, BellIcon } from "lucide-react";

const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

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
              <Icon className="size-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
