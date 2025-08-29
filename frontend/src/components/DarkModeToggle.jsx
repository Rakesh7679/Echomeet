import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="btn btn-ghost btn-circle hover:bg-base-200 transition-colors"
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-slate-600" />
      )}
    </button>
  );
};

export default DarkModeToggle;
