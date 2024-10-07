import React, {useContext} from "react";
import AppRouter from "./router/AppRouter";
import {ThemeContext} from "./contexts/ThemeContext";
import {ToastContainer} from "react-toastify";
import {createTheme, ThemeProvider} from "@mui/material";

const App = () => {
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;

  return (
    <div
      style={{
        backgroundColor: themeContext.theme.colors.background,
        color: themeContext.theme.colors.text,
      }}>
      <ThemeProvider theme={colorTheme === "light" ? lightTheme : darkTheme}>
        <AppRouter />
      </ThemeProvider>
    </div>
  );
};

export default App;

const THEME = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  colors: {
    text: "#000",
    background: "#fff",
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
    color: "#000",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  colors: {
    text: "#fff",
    background: "#000",
    color: "#fff",
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});
