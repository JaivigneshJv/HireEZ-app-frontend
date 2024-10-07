import React, {useContext, useState} from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  Autocomplete,
  Chip,
  CssBaseline,
  Paper,
  Snackbar,
} from "@mui/material";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {ThemeContext} from "../../contexts/ThemeContext";
import axiosInstance from "../../api/axios";
import JobListing from "../../assets/images/joblisting.png";

const NewListingForm = ({user}) => {
  console.log(user.companyName);
  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    location: "",
    salary: 0,
    jobType: "",
    applicationDeadline: new Date(),
    numberOfRounds: 0,
    roundNames: "",
  });

  const [roundNames, setRoundNames] = useState([]);
  const [snackbarText, setSnackbarText] = useState("");
  const [open, setOpen] = useState(false);
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;
  const roundOptions = [
    {title: "Coding Round"},
    {title: "Interview"},
    {title: "HR Round"},
    {title: "Technical Round"},
    {title: "Group Discussion"},
    // Add more options as needed
  ];

  const handleInputChange = (event) => {
    const {name, value} = event.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      applicationDeadline: date,
    }));
  };

  const handleRoundsChange = (event, value) => {
    setRoundNames(value);
    const roundNamesString = value.map((round) => round.title).join(", ");
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      roundNames: roundNamesString,
      numberOfRounds: value.length,
    }));
  };

  const validate = () => {
    const tempErrors = {};
    tempErrors.title = jobDetails.title ? "" : "Title is required.";
    tempErrors.description = jobDetails.description
      ? ""
      : "Description is required.";
    tempErrors.location = jobDetails.location ? "" : "Location is required.";
    tempErrors.salary = jobDetails.salary ? "" : "Salary is required.";
    tempErrors.jobType = jobDetails.jobType ? "" : "Job Type is required.";
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validate()) {
      const updatedJobDetails = {
        ...jobDetails,
        title: `${user.companyName} - ${jobDetails.title}`,
      };
      axiosInstance
        .post(`/JobListing/company/create-listing`, updatedJobDetails, {
          withCredentials: true,
        })
        .then(() => {
          setSnackbarText("Job details submitted successfully!");
          setOpen(true);

          setTimeout(() => {
            window.location.reload();
          });
        });
    } else {
      setSnackbarText("Please fill in all required fields.");
      setOpen(true);
    }
  };

  return (
    <Grid container component="main" sx={{height: "90vh"}}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          // backgroundColor: colorTheme === "light" ? "#1976D2" : "#a1a1a1",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: `url(${JobListing})`,
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
        <Grid
          sx={{
            overflow: "hidden",
            overflowY: "scroll",
          }}
          display="flex"
          justifyContent="center"
          alignItems="center"
          elevation={6}>
          <Grid
            xs={8}
            sx={{
              padding: 2,
            }}>
            <Typography variant="h5" gutterBottom>
              Job Details Form
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={jobDetails.title}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    name="description"
                    value={jobDetails.description}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={jobDetails.location}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Salary"
                    name="salary"
                    type="number"
                    value={jobDetails.salary}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Job Type"
                    name="jobType"
                    value={jobDetails.jobType}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Application Deadline"
                      value={jobDetails.applicationDeadline}
                      onChange={handleDateChange}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="round-names"
                    value={roundNames}
                    onChange={handleRoundsChange}
                    options={roundOptions}
                    getOptionLabel={(option) => option.title}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          key={option.title}
                          label={option.title}
                          {...getTagProps({index})}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Round Names"
                        placeholder="Add rounds"
                      />
                    )}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
            <Snackbar
              open={open}
              autoHideDuration={6000}
              onClose={() => setOpen(false)}
              message={snackbarText}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewListingForm;
