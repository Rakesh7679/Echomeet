import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  // Filter out basic light/dark themes since we have a separate toggle
  const advancedThemes = THEMES.filter(t => !["light", "dark"].includes(t.name));

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button tabIndex={0} className="btn btn-ghost btn-circle btn-sm sm:btn-md" title="Advanced Themes">
        <PaletteIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
        w-56 border border-base-content/10 max-h-80 overflow-y-auto"
      >
        <div className="p-2 border-b border-base-content/10">
          <p className="text-xs font-medium text-base-content/70">Advanced Themes</p>
        </div>
        <div className="space-y-1 p-1">
          {advancedThemes.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`
              w-full px-3 py-2 rounded-xl flex items-center gap-3 transition-colors text-sm
              ${
                theme === themeOption.name
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-base-content/5"
              }
            `}
              onClick={() => setTheme(themeOption.name)}
            >
              <PaletteIcon className="h-3 w-3" />
              <span className="font-medium">{themeOption.label}</span>
              {/* THEME PREVIEW COLORS */}
              <div className="ml-auto flex gap-1">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ThemeSelector;
