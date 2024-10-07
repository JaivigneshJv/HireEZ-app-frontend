import React, {useState} from "react";
import {
  Button,
  Divider,
  Grid,
  Skeleton,
  Snackbar,
  Typography,
} from "@mui/material";
import {styled} from "@mui/material/styles";
import {CloudUpload} from "@mui/icons-material";
import DoneIcon from "@mui/icons-material/Done";
import axios from "axios";
import axiosInstance from "../../api/axios";
import SpinnerLoader from "../spinner/SpinnerLoader";
import {ThemeContext} from "../../contexts/ThemeContext";

const ApplyJob = ({jobListing}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const snackBar = (snackbarText) => {
    setSnackbarText(snackbarText);
    setOpen(true);
  };
  const [currentPdf, setCurrentPdf] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [coverLetterData, setCoverLetterData] = useState(null);

  const handleFileChange = (event, setData) => {
    const file = event.target.files[0];

    if (file && file.type === "application/pdf") {
      const fileURL = URL.createObjectURL(file);
      setData({uri: fileURL, fileName: file.name, file: file});
      setCurrentPdf(fileURL);
    } else {
      snackBar("Please upload a PDF file.");
    }
  };

  const uploadFileToCloudinary = async (file) => {
    const cloudinaryURL = `https://api.cloudinary.com/v1_1/duutlmlfo/upload`;
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "yozix8qe");

    try {
      const response = await axios.post(cloudinaryURL, formData);
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading file to Cloudinary:", error);
      snackBar("Failed to upload file.");
      return null;
    }
  };

  const handleApplyClick = async () => {
    if (resumeData && coverLetterData) {
      setLoading(true);
      const resumeUrl = await uploadFileToCloudinary(resumeData.file);
      const coverLetterUrl = await uploadFileToCloudinary(coverLetterData.file);
      await axiosInstance
        .post(
          "/JobApplication/user/apply",
          {
            jobListingId: jobListing.jobListingId,
            resumeUrl: resumeUrl,
            coverLetter: coverLetterUrl,
          },
          {withCredentials: true}
        )
        .then((res) => {
          snackBar(res.data.message);
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        })
        .catch((error) => {
          snackBar("Failed to submit application. Redirecting");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
      if (resumeUrl && coverLetterUrl) {
        snackBar("Application submitted successfully!");
      }
    } else {
      snackBar("Please upload both resume and cover letter.");
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

  const themeContext = React.useContext(ThemeContext);

  return (
    <Grid container spacing={2}>
      <Grid
        item
        xs={12}
        sx={{
          borderBottom: "1px solid #ccc",
        }}>
        <Typography
          variant="h4"
          p={2}
          sx={{
            fontFamily: "Poppins",
            color:
              themeContext.theme.palette.mode === "light" ? "#000" : "#fff",
          }}>
          Apply - {jobListing.title}
        </Typography>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={3}
        lg={2}
        marginTop={"25px"}
        height={"70vh"}>
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}>
            Upload Resume
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => {
                handleFileChange(e, setResumeData);
              }}
            />
          </Button>
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}>
            Upload Cover Letter
            <VisuallyHiddenInput
              type="file"
              onChange={(e) => {
                handleFileChange(e, setCoverLetterData);
              }}
            />
          </Button>
          <Divider />
          {resumeData && (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography variant="body1">
                Resume: {resumeData.fileName.toString().slice(0, 30)}
              </Typography>
              <DoneIcon />
            </Grid>
          )}
          {coverLetterData && (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
              <Typography variant="body1">
                Cover Letter: {coverLetterData.fileName.toString().slice(0, 20)}
                ...
              </Typography>
              <DoneIcon />
            </Grid>
          )}

          <Button variant="outlined" onClick={handleApplyClick}>
            Apply
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} md={9} lg={10} marginTop={"25px"} padding={2}>
        {currentPdf && <iframe src={currentPdf} width="100%" height="100%" />}
        {currentPdf === null && (
          <>
            <Typography variant="body2" textAlign="left" marginBottom={"1em"}>
              Preview will be shown here
            </Typography>
            <Skeleton variant="rectangular" width={"100%"} height={"90%"} />
          </>
        )}
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        // onClose={}
        message={snackbarText}
      />
    </Grid>
  );
};

export default ApplyJob;
