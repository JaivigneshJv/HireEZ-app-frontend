import React, {useState, useEffect} from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {Navigate, useNavigate} from "react-router-dom";
import axiosInstance from "../../api/axios";
import Image from "../../assets/images/customer-support.png";
import Logo from "../../assets/images/logo1.png";
import {MuiOtpInput} from "mui-one-time-password-input";
import SpinnerLoader from "../../components/spinner/SpinnerLoader";

const defaultTheme = createTheme();

const EmailVerification = () => {
  const [register, setRegister] = useState(() => {
    if (window.location.pathname === "/register/verify") {
      return true;
    } else return false;
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setLoading(true);
    generateVerificationToken();
  }, []);
  const generateVerificationToken = async () => {
    await axiosInstance
      .post(
        "/Auth/verify/generate-verification-code",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          setMessage("OTP has been sent to your email.");
        }
      })
      .catch((error) => {
        if (error.status === 401) {
          navigate("/dashboard");
        }
      });
  };
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (/^\d*$/.test(otp) === false) {
      setMessage("Please enter valid OTP");
      setOtp("");
      return;
    }

    axiosInstance
      .post(`/Auth/verify/verify-code/${otp}`, {}, {withCredentials: true})
      .then((res) => {
        res.status === 200 && navigate("/dashboard");
      })
      .catch((error) => {
        setOtp("");

        setMessage(error.response.data.message);
      });
  };

  if (loading) {
    return (
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
          display={"flex"}
          style={{minHeight: "100vh"}}>
          <SpinnerLoader />
        </Grid>
      </Grid>
    );
  }

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
              mx: 8,
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
              <MuiOtpInput
                value={otp}
                gap={1}
                length={6}
                autoFocus
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{mt: 3, mb: 2}}>
                Verify OTP
              </Button>
              <Grid container>
                <Grid item xs>
                  <Typography variant="body2" color="textSecondary">
                    {message}
                  </Typography>
                </Grid>
                <Grid item>
                  <Link
                    sx={{cursor: "pointer"}}
                    variant="body2"
                    onClick={() => {
                      generateVerificationToken();
                    }}>
                    {"Resend OTP?"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default EmailVerification;
