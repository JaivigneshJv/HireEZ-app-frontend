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

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/Banner", {withCredentials: true});
        setBannerData(res.data);
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
      {bannerData.map((data) => (
        <Card
          key={data.bannerId}
          sx={{maxWidth: 330, cursor: "pointer"}}
          onClick={() => {
            window.open(data.link, "_blank");
          }}>
          <CardMedia
            sx={{height: 140}}
            image={data.imageUrl}
            title={data.title}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.content.substring(0, 200) + "..."}
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

export default Home;
