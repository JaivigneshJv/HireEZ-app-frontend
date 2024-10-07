// ThemeToggleButton.jsx
import React, {useContext} from "react";
import {IconButton} from "@mui/material";
import {Brightness4, Brightness7} from "@mui/icons-material";
import {ThemeContext} from "../../contexts/ThemeContext";

const ThemeToggleButton = () => {
  const {theme, toggleTheme} = useContext(ThemeContext);

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {theme.palette.mode === "light" ? (
        <Brightness4
          sx={{
            color: "black",
          }}
        />
      ) : (
        <Brightness7 />
      )}
    </IconButton>
  );
};

export default ThemeToggleButton;
