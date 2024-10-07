import React from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CssBaseline,
  Paper,
  Button,
} from "@mui/material";
import Image from "../../assets/images/72.png";
import Logo from "../../assets/images/logo2.png";
import axiosInstance from "../../api/axios";
import {useNavigate} from "react-router-dom";

const InfoPage = ({message}) => {
  const navigate = useNavigate();
  const logout = () => {
    axiosInstance
      .post(
        "/Auth/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          navigate("/login");
        }
      })
      .catch((error) => {});
  };
  return (
    <Grid container component="main" sx={{height: "100vh"}}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={8}
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
        md={4}
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
          <Box>
            <Typography variant="h6" component="h2" align="center">
              {message}
            </Typography>
            <Typography variant="body2" component="p" align="center">
              Please contact the admin for further information
            </Typography>
          </Box>
          <Box
            sx={{
              my: 4,
            }}>
            <Button
              variant="contained"
              onClick={() => {
                logout();
              }}>
              Logout
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

InfoPage.propTypes = {
  message: PropTypes.string.isRequired,
};

export default InfoPage;
