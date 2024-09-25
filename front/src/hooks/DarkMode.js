import { useEffect, useState } from "react";

const DarkMode = () => {
  // Check local storage for the theme preference, default to light if not found
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");
  const colorTheme = theme === "light" ? "dark" : "light";

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.add(theme);
    root.classList.remove(colorTheme);

    // Save the theme to local storage
    localStorage.setItem("theme", theme);
  }, [theme, colorTheme]);

  return [setTheme, colorTheme];
};

export default DarkMode;

