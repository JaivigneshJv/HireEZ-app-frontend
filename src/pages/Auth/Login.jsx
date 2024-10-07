import React, {useEffect, useState} from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../api/axios";
import Image from "../../assets/images/71.png";
import Logo from "../../assets/images/logo1.png";
import {Snackbar} from "@mui/material";

const defaultTheme = createTheme();

const Login = () => {
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const snackBar = (snackbarText) => {
    setSnackbarText(snackbarText);
    setOpen(true);
  };
  const [formData, setFormData] = useState({email: "", password: ""});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }
    return newErrors;
  };

  const handleChange = (event) => {
    const {name, value} = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoadingAuth(true);
      await axiosInstance
        .post("/Auth/login", formData, {withCredentials: true})
        .then((res) => {
          if (res.status === 200) {
            navigate("/dashboard");
            window.location.reload();
          }
        })
        .catch((err) => {
          snackBar(err.response.data.message);
          console.error(err);
          setLoadingAuth(false);
        });
      setLoadingAuth(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{height: "100vh"}}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Image})`,
            backgroundColor: "#1976D2",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          alignItems={"center"}
          justifyContent={"center"}
          display={"flex"}>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <img
              src={Logo}
              alt=""
              style={{
                width: "200px",
                height: "120px",
              }}
            />
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{mt: 1}}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password}
                onChange={handleChange}
              />
              <Button
                disabled={loadingAuth}
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}>
                Sign In
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link
                    sx={{cursor: "pointer"}}
                    variant="body2"
                    onClick={() => {
                      navigate("/register");
                    }}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          // onClose={}
          message={snackbarText}
        />
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
