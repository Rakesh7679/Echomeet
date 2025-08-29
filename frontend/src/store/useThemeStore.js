import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("streamify-theme") || "light",
  isDarkMode: localStorage.getItem("streamify-theme") === "dark",
  setTheme: (theme) => {
    localStorage.setItem("streamify-theme", theme);
    set({ theme, isDarkMode: theme === "dark" });
  },
  toggleDarkMode: () => {
    const newTheme = localStorage.getItem("streamify-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("streamify-theme", newTheme);
    set({ theme: newTheme, isDarkMode: newTheme === "dark" });
  },
}));
