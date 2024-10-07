import React, {useState, useEffect} from "react";
import {Navigate} from "react-router-dom";
import axiosInstance from "../api/axios";
import Customer from "../pages/Dashboard/Customer";
import Company from "../pages/Dashboard/Company";
import Login from "../pages/Auth/Login";
import {Grid} from "@mui/material";
import SpinnerLoader from "../components/spinner/SpinnerLoader";
import InfoPage from "../pages/Info/InfoPage";
import UserProfileRoute from "./UserProfileRoute";

const AuthRoute = () => {
  const [data, setData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/Auth/user", {
          withCredentials: true,
        });
        setData(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{minHeight: "100vh"}}>
        <SpinnerLoader />
      </Grid>
    );
  }

  return isAuthenticated ? (
    data.status === "Pending" ? (
      <InfoPage
        message={`Your Account is yet to be approved,${data.username}`}
      />
    ) : data.status === "Pending Email" ? (
      data.role === "User" ? (
        <Navigate to="/login/verify" />
      ) : (
        <Navigate to="/register/verify" />
      )
    ) : (
      <UserProfileRoute user={data.role} userData={data} />
    )
  ) : (
    <Login />
  );
};

export default AuthRoute;
