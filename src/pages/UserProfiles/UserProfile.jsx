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
  Stack,
  Chip,
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

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [Imagedata, setData] = useState(null);
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    bio: "",
    skills: "skills(separated by commas)",
    experience: "experience(separated by commas)",
    education: "education(separated by commas)",
    resumeUrl: "",
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
      setUser((prevUser) => ({
        ...prevUser,
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
      setUser((prevUser) => ({
        ...prevUser,
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
      .get("/UserProfile", {withCredentials: true})
      .then((response) => {
        setUser(response.data.userProfile);
        setNewUser(false);
        setLoading(false);
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          <Navigate to="/dashboard" />;
          window.location.reload();
        } else {
          setIsEditing(true);
          setNewUser(true);
          setLoading(false);
        }
      });
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.bio = user.bio ? "" : "Bio is required.";
    tempErrors.skills = user.skills ? "" : "Skills are required.";
    tempErrors.experience = user.experience ? "" : "Experience is required.";
    tempErrors.education = user.education ? "" : "Education is required.";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (validate()) {
      try {
        if (newUser) {
          const imageurl = await handleImageUpload();
          var temp = user;
          temp.profilePictureUrl = imageurl;
          await axiosInstance.post("/UserProfile", temp, {
            withCredentials: true,
          });
          <Navigate to="/dashboard" />;
          window.location.reload();
        } else {
          var temp = user;

          if (Imagedata) {
            const imageurl = await handleImageUpload();
            temp.profilePictureUrl = imageurl;
          }
          await axiosInstance.put("/UserProfile", temp, {
            withCredentials: true,
          });
        }
        setIsEditing(false);
        window.location.reload();
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const renderChips = (items) => {
    return items
      .split(",")
      .map((item, index) => (
        <Chip key={index} label={item.trim()} sx={{margin: "2px"}} />
      ));
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
                      alt={user.username}
                      src={user.profilePictureUrl}
                      sx={{width: 100, height: 100}}
                    />
                    {isEditing ? (
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
                    ) : null}
                  </Box>
                </Grid>
                {isEditing ? (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Bio"
                        name="bio"
                        value={user.bio}
                        onChange={handleChange}
                        error={!!errors.bio}
                        helperText={errors.bio}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Skills"
                        name="skills"
                        value={user.skills}
                        onChange={handleChange}
                        error={!!errors.skills}
                        helperText={errors.skills}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Experience"
                        name="experience"
                        value={user.experience}
                        onChange={handleChange}
                        error={!!errors.experience}
                        helperText={errors.experience}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Education"
                        name="education"
                        value={user.education}
                        onChange={handleChange}
                        error={!!errors.education}
                        helperText={errors.education}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      display="flex"
                      justifyContent="space-between">
                      <Button variant="contained" onClick={handleSave}>
                        Save
                      </Button>
                      {newUser ?? (
                        <Button
                          variant="outlined"
                          onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                      )}
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Bio:</strong> {user.bio}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Skills:</strong> {renderChips(user.skills)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Experience:</strong> {user.experience}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body1">
                        <strong>Education:</strong> {user.education}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      display="flex"
                      justifyContent="center"
                      marginTop={2}>
                      <Button variant="contained" onClick={handleEdit}>
                        Edit Profile
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </CardContent>
          </Grid>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        message={snackbarText}
      />
    </Grid>
  );
};

export default UserProfile;
