import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {CssBaseline} from "@mui/material";
import {ThemeProviderComponent} from "./contexts/ThemeContext";
import "../src/css/index.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProviderComponent>
      <App />
    </ThemeProviderComponent>
  </React.StrictMode>
);
