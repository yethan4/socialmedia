import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));

    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return {darkMode, setDarkMode};
};
