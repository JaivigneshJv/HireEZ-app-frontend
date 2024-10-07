import React, {useState} from "react";
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
import UserImage from "../../assets/images/71.png";
import CompanyImage from "../../assets/images/72.png";
import Logo from "../../assets/images/logo1.png";
import axiosInstance from "../../api/axios";
import {Snackbar} from "@mui/material";

const defaultTheme = createTheme();

const Register = () => {
  const [snackbarText, setSnackbarText] = useState("");
  const [open, setOpen] = React.useState(false);

  const snackBar = (snackbarText) => {
    setSnackbarText(snackbarText);
    setOpen(true);
  };
  const [role, setRole] = useState("user");
  const [company, setCompany] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const swapRole = () => {
    setCompany((prev) => !prev);
    setRole((prev) => (prev === "user" ? "company" : "user"));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = company
        ? "Company Name is required."
        : "Name is required.";
    }
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special character.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone Number is required.";
    } else if (!/^\+?\d{1,4}?\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format.";
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      axiosInstance
        .post("/Auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: company ? "Company" : "User",
        })
        .then((res) => {
          axiosInstance
            .post(
              "/Auth/login",
              {
                email: formData.email,
                password: formData.password,
              },
              {withCredentials: true}
            )
            .then((res) => {
              if (res.status === 200) {
                snackBar("Registration Successful! Redirecting to Login...");
                setTimeout(() => {}, 3000);
                navigate("/register/verify");
              }
            });
        })
        .catch((err) => {
          snackBar(err.response.data.message);
          setTimeout(() => {}, 3000);
        });
      snackBar("Registration Successful");
      setTimeout(() => {}, 3000);
      navigate("/dashboard");
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
            backgroundImage: company
              ? `url(${CompanyImage})`
              : `url(${UserImage})`,
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
              mx: 12,
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
            <Typography
              component="h1"
              variant="h5"
              justifySelf={"left"}
              justifyContent={"flex-start"}
              width={"100%"}
              display={"flex"}>
              {company ? "Register as a Company" : "Register "}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{mt: 1}}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label={company ? "Company Name" : "Name"}
                name="name"
                autoComplete="name"
                autoFocus
                error={!!errors.name}
                helperText={errors.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label={company ? "Company Email Address" : "Email Address"}
                name="email"
                autoComplete="email"
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
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone Number"
                name="phone"
                autoComplete="phone"
                error={!!errors.phone}
                helperText={errors.phone}
                onChange={handleChange}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}>
                Sign Up
              </Button>
              <Grid container justifyContent={"space-between"}>
                <Grid item xs={12} sm={6}>
                  <Link
                    sx={{cursor: "pointer"}}
                    variant="body2"
                    onClick={swapRole}>
                    {company ? "Register as User?" : "Register as a company?"}
                  </Link>
                </Grid>
                <Grid item>
                  <Link
                    sx={{cursor: "pointer"}}
                    variant="body2"
                    onClick={() => {
                      navigate("/login");
                    }}>
                    {"Already have an account? Sign In"}
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

export default Register;
