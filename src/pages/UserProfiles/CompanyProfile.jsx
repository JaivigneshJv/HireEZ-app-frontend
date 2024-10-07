import React, {useState, useEffect} from "react";
import {
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  CssBaseline,
  Paper,
  styled,
  IconButton,
  Box,
  Snackbar,
} from "@mui/material";
import axiosInstance from "../../api/axios";
import Image from "../../assets/images/71.png";
import SpinnerLoader from "../../components/spinner/SpinnerLoader";
import {Navigate} from "react-router-dom";
import {CloudUpload} from "@mui/icons-material";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const CompanyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [Imagedata, setData] = useState(null);

  const [newCompany, setNewCompany] = useState(false);
  const [company, setCompany] = useState({
    companyName: "",
    description: "",
    location: "",
    websiteUrl: "",
    profilePictureUrl: "",
  });
  const [snackbarText, setSnackbarText] = useState("");
  const [open, setOpen] = useState(false);

  const snackBar = (text) => {
    setSnackbarText(text);
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleFileChange = async (event) => {
    const file = event;
    if (file && file.type.startsWith("image/")) {
      const fileURL = URL.createObjectURL(file);
      setData({uri: fileURL, fileName: file.name, file: file});
      setCompany((prevCompany) => ({
        ...prevCompany,
        profilePictureUrl: fileURL,
      }));
    } else {
      snackBar("Please upload an image file.");
    }
  };

  const handleImageUpload = async () => {
    const formData = new FormData();
    formData.append("file", Imagedata.file);
    formData.append("upload_preset", "yozix8qe");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duutlmlfo/upload",
        formData
      );
      setCompany((prevCompany) => ({
        ...prevCompany,
        profilePictureUrl: response.data.url,
      }));
      return response.data.url;
    } catch (error) {
      console.error("Error uploading image:", error);
      snackBar("Error uploading image.");
    }
  };

  const [errors, setErrors] = useState({});

  useEffect(() => {
    axiosInstance
      .get("/CompanyProfile", {withCredentials: true})
      .then((response) => {
        setCompany(response.data.companyProfile);
        setNewCompany(false);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          <Navigate to="/dashboard" />;
          window.location.reload();
        } else {
          setIsEditing(true);
          setNewCompany(true);
          setLoading(false);
        }
      });
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setCompany((prevCompany) => ({
      ...prevCompany,
      [name]: value,
    }));
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.companyName = company.companyName
      ? ""
      : "Company name is required.";
    tempErrors.description = company.description
      ? ""
      : "Description is required.";
    tempErrors.location = company.location ? "" : "Location is required.";
    tempErrors.websiteUrl = company.websiteUrl
      ? ""
      : "Website URL is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (validate()) {
      try {
        if (newCompany) {
          const imageurl = await handleImageUpload();
          var temp = company;
          temp.profilePictureUrl = imageurl;
          await axiosInstance.post("/CompanyProfile", temp, {
            withCredentials: true,
          });
          <Navigate to="/dashboard" />;
          window.location.reload();
        } else {
          var temp = company;

          if (Imagedata) {
            const imageurl = await handleImageUpload();
            temp.profilePictureUrl = imageurl;
          }
          await axiosInstance.put("/CompanyProfile", temp, {
            withCredentials: true,
          });
        }
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  if (loading) {
    return (
      <Grid container component="main" sx={{}}>
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
    <Grid container component="main" sx={{height: "100vh"}}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={3}
        md={5}
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
        sm={9}
        md={7}
        component={Paper}
        elevation={6}
        square
        alignItems={"center"}
        justifyContent={"center"}
        display={"flex"}>
        <Grid
          display="flex"
          justifyContent="center"
          alignItems="center"
          elevation={6}>
          <Grid
            xs={8}
            sx={{
              padding: 2,
            }}>
            <CardContent>
              <Grid
                container
                component={Paper}
                elevation={6}
                spacing={1}
                padding={4}
                borderRadius={10}>
                <Grid
                  item
                  xs={12}
                  display="flex"
                  justifyContent="center"
                  flexDirection={"row"}>
                  <Box position="relative">
                    <Avatar
                      alt={company.companyName}
                      src={company.profilePictureUrl}
                      sx={{width: 100, height: 100}}
                    />
                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        borderRadius: "50%",
                        padding: "5px",
                      }}>
                      <VisuallyHiddenInput
                        type="file"
                        onChange={(e) => {
                          handleFileChange(e.target.files[0]);
                        }}
                      />
                      <CloudUpload />
                    </IconButton>
                  </Box>
                </Grid>
                {isEditing ? (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Company Name"
                        name="companyName"
                        value={company.companyName}
                        onChange={handleChange}
                        error={!!errors.companyName}
                        helperText={errors.companyName}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Description"
                        name="description"
                        value={company.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Location"
                        name="location"
                        value={company.location}
                        onChange={handleChange}
                        error={!!errors.location}
                        helperText={errors.location}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Website URL"
                        name="websiteUrl"
                        value={company.websiteUrl}
                        onChange={handleChange}
                        error={!!errors.websiteUrl}
                        helperText={errors.websiteUrl}
                      />
                    </Grid>
                    <Grid
                      marginTop={5}
                      item
                      xs={12}
                      display="flex"
                      justifyContent="flex-end">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={handleSave}>
                        Save
                      </Button>

                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        {company.companyName}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {company.description}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {company.location}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        {company.websiteUrl}
                      </Typography>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={handleEdit}>
                        Edit
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={snackbarText}
          action={
            <React.Fragment>
              <Button color="secondary" size="small" onClick={handleClose}>
                Close
              </Button>
            </React.Fragment>
          }
        />
      </Grid>
    </Grid>
  );
};

export default CompanyProfile;
