import {
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import React, {useState, useEffect} from "react";
import AddIcon from "@mui/icons-material/Add";
import SpinnerLoader from "../spinner/SpinnerLoader";
import axiosInstance from "../../api/axios";

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [bannerData, setBannerData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    jobListingId: "",
    reportType: "Mention Company Name , Job Title",
    reportContent: "Add Every Relevant Details",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/Report/get-all", {
          withCredentials: true,
        });
        setBannerData(res.data.report);
      } catch (error) {
      } finally {
        setLoading(false);
      }

      try {
        const res = await axiosInstance.post(
          "/JobApplication/user/get-applications",
          {
            pageNumber: 1,
            pageSize: 200,
          },
          {withCredentials: true}
        );
        setApplicationData(res.data.jobApplication);
      } catch (error) {}
    };

    fetchData();
  }, []);

  const handleCardClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/Report/create", formData, {
        withCredentials: true,
      });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating report:", error);
    }
  };

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
      <Card
        onClick={handleCardClick}
        sx={{
          maxHeight: "30vh",
          width: "300px",
          borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}>
        <AddIcon
          sx={{
            fontSize: "3em",
          }}
        />
      </Card>
      {showForm && (
        <Card
          sx={{
            width: "300px",
            maxHeight: "30vh",
            overflow: "hidden",
            overflowY: "scroll",
          }}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                select
                label="Job Listing"
                name="jobListingId"
                value={formData.jobListingId}
                onChange={handleInputChange}
                fullWidth
                margin="normal">
                {applicationData.map((app) => (
                  <MenuItem key={app.id} value={app.jobListingId}>
                    Job Applied @{new Date(app.applicationDate).toDateString()}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Report Type"
                name="reportType"
                value={formData.reportType}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Report Content"
                name="reportContent"
                value={formData.reportContent}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
              />
              <Button type="submit" variant="outlined" color="primary">
                Submit
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      {bannerData.map((data, index) => (
        <Card key={index} sx={{width: "300px", maxHeight: "30vh"}}>
          <CardContent>
            <Typography variant="h6">{data.reportType}</Typography>
            <Typography
              sx={{
                marginTop: "1em",
              }}>
              {data.reportContent.slice(0, 200)}...
            </Typography>
            <Typography
              sx={{
                marginTop: "1em",
                display: "flex",
                justifyContent: "flex-end",
              }}>
              {new Date(data.reportedDate).toDateString()} - {data.status}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
};

export default Reports;
