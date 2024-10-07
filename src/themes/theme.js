import {createTheme} from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
  colors: {
    text: "#000",
    background: "#fff",
    primary: "#33e",
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
  colors: {
    text: "#fff",
    background: "#000",
    primary: "#33e",
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export {lightTheme, darkTheme};
