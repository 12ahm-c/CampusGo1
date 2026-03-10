// src/context/ThemeContext.jsx

import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [darkMode, setDarkMode] = useState(true); // الوضع الافتراضي Dark

  useEffect(() => {

    const stored = localStorage.getItem("darkMode");

    if (stored === null) {
      setDarkMode(true); // أول دخول = Dark
    } else {
      setDarkMode(stored === "true");
    }

  }, []);

  useEffect(() => {

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    localStorage.setItem("darkMode", darkMode);

  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );

};