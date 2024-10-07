import React, {useState, useEffect} from "react";
import axiosInstance from "../../api/axios";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  ListItem,
  Typography,
} from "@mui/material";
import SpinnerLoader from "../spinner/SpinnerLoader";

const Company = () => {
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/CompanyProfile/all-company", {
          withCredentials: true,
        });
        setBannerData(res.data.companyProfiles);
      } catch (error) {
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

  return (
    <Grid
      container
      spacing={{}}
      columns={{xs: 4, sm: 8, md: 12}}
      gap={3}
      sx={{
        overflow: "hidden",
        overflowY: "auto",
        height: "85vh",
      }}>
      {bannerData.map((data, index) => (
        <Card
          key={index}
          sx={{maxWidth: 330, cursor: "pointer", maxHeight: 300}}
          onClick={() => {
            window.open(data.websiteUrl, "_blank");
          }}>
          <CardMedia
            sx={{height: 140}}
            image={data.profilePictureUrl}
            title={data.companyName}
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {data.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.location}
            </Typography>
          </CardContent>
        </Card>
        // <Grid item xs={4} sm={4} md={4} key={data.bannerId}>
        //   <ListItem>{data.title}</ListItem>
        // </Grid>
      ))}
    </Grid>
  );
};

export default Company;
