import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.classList.add(savedTheme);
      document.body.classList.add(savedTheme);
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    document.documentElement.classList.remove(isDarkMode ? "dark" : "light");
    document.documentElement.classList.add(newTheme);
    document.body.classList.remove(isDarkMode ? "dark" : "light");
    document.body.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
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
