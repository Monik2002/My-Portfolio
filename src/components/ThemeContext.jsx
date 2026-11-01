"use client";

import {
  createContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import PropTypes from "prop-types";

export const ThemeContext = createContext();

const themeChangedEvent = "portfolio-theme-change";
let inMemoryDarkMode = false;

function getDarkModeSnapshot() {
  try {
    const savedTheme = window.localStorage.getItem("theme");
    if (savedTheme !== null) {
      inMemoryDarkMode = savedTheme === "dark";
    }
  } catch (error) {
    console.error("Could not read the saved theme preference.", error);
  }

  return inMemoryDarkMode;
}

function subscribeToThemeChanges(callback) {
  window.addEventListener(themeChangedEvent, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(themeChangedEvent, callback);
    window.removeEventListener("storage", callback);
  };
}

export const ThemeProvider = ({ children }) => {
  const isDarkMode = useSyncExternalStore(
    subscribeToThemeChanges,
    getDarkModeSnapshot,
    () => false
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    inMemoryDarkMode = !isDarkMode;
    try {
      window.localStorage.setItem(
        "theme",
        inMemoryDarkMode ? "dark" : "light"
      );
    } catch (error) {
      console.error("Could not save the theme preference.", error);
    }
    window.dispatchEvent(new Event(themeChangedEvent));
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// PropTypes validation
ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
