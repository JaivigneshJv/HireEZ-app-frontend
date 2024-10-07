import React, {useState, useEffect} from "react";
import Customer from "../pages/Dashboard/Customer";
import Company from "../pages/Dashboard/Company";
import {Grid} from "@mui/material";
import SpinnerLoader from "../components/spinner/SpinnerLoader";
import UserProfile from "../pages/UserProfiles/UserProfile";
import axiosInstance from "../api/axios";
import CompanyProfile from "../pages/UserProfiles/CompanyProfile";

const UserProfileRoute = ({user, userData}) => {
  const [data, setData] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get(
          `${user === "Company" ? "/CompanyProfile" : "/UserProfile"}`,
          {
            withCredentials: true,
          }
        );

        setData(
          user === "Company"
            ? response.data.companyProfile
            : response.data.userProfile
        );
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
    user === "Company" ? (
      <Company user={data} userData={userData} />
    ) : (
      <Customer user={data} userData={userData} />
    )
  ) : user === "Company" ? (
    <CompanyProfile />
  ) : (
    <UserProfile />
  );
};

export default UserProfileRoute;
