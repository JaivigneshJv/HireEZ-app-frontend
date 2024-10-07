import React, {createContext, useState, useEffect} from "react";
import {ThemeProvider} from "@mui/material/styles";
import {lightTheme, darkTheme} from "../themes/theme";

const ThemeContext = createContext();

const ThemeProviderComponent = ({children}) => {
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme === "light" ? lightTheme : darkTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme.palette.mode === "light" ? darkTheme : lightTheme;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme.palette.mode);
  };

  return (
    <ThemeContext.Provider value={{theme, toggleTheme}}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};

export {ThemeContext, ThemeProviderComponent};
