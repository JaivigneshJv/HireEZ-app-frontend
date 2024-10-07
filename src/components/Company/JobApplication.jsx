import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React, {useEffect} from "react";
import SpinnerLoader from "../spinner/SpinnerLoader";
import axiosInstance from "../../api/axios";
import {ExpandMore} from "@mui/icons-material";

const JobApplication = ({
  setCurrentTab,
  activeJobListingId,
  setActiveJobApplicationId,
}) => {
  const [pdfContent, setPdfContent] = React.useState("resume");
  const [loading, setLoading] = React.useState(true);
  const [jobData, setJobData] = React.useState([]);
  const [expandedJobApplicationId, setExpandedJobApplicationId] =
    React.useState(null);
  const [jobApplicationData, setJobApplicationData] = React.useState([]);
  const [activeJobListing, setActiveJobListing] = React.useState(
    activeJobListingId ?? null
  );

  const handleChange = (event) => {
    setActiveJobListing(event.target.value);
  };

  useEffect(() => {
    const fetchdata = async () => {
      axiosInstance
        .get("/JobListing/company/getall", {withCredentials: true})
        .then((res) => {
          setJobData(res.data.jobListing);
          setLoading(false);
        })
        .catch((error) => {});
    };
    fetchdata();
  }, []);

  useEffect(() => {
    if (activeJobListing) {
      setLoading(true);
      const fetchdata = async () => {
        axiosInstance
          .post(
            `/JobApplication/company/get-applications/${activeJobListing}`,
            {
              pageNumber: 1,
              pageSize: 200,
            },
            {withCredentials: true}
          )
          .then((res) => {
            const sortedApplications = res.data.jobApplication.sort(
              (a, b) =>
                new Date(b.applicationDate) - new Date(a.applicationDate)
            );
            // Create a new array with numbered display names
            const applicationsWithNumbers = sortedApplications.map(
              (app, index) => ({
                ...app,
                displayName: `#${index + 1} ${app.status} - ${new Date(
                  app.applicationDate
                ).toDateString()}`,
              })
            );
            setJobApplicationData(applicationsWithNumbers);
            setLoading(false);
          })
          .catch((error) => {});
      };
      fetchdata();
    }
  }, [activeJobListing]);

  const handleExpandClick = (id) => {
    setExpandedJobApplicationId((prevId) => (prevId === id ? null : id));
  };

  const handleRejectApplication = (id) => {
    axiosInstance
      .post(
        `/JobApplication/company/reject-applications/${id}`,
        {},
        {withCredentials: true}
      )
      .then((res) => {
        setJobApplicationData((prevData) =>
          prevData.filter((data) => data.id !== id)
        );
      });
  };

  const handleAcceptApplication = (id) => {
    axiosInstance
      .post(
        `/JobApplication/company/accept-applications/${id}`,
        {},
        {withCredentials: true}
      )
      .then((res) => {
        setJobApplicationData((prevData) =>
          prevData.filter((data) => data.jobApplicationId !== id)
        );
      });
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
    <Grid container>
      <Grid item xs={12}>
        <Box sx={{flexGrow: 1}}>
          <Paper elevation={2}>
            <Box
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "row",
                marginTop: "1em",
                padding: "1em",
                cursor: "pointer",
              }}>
              {jobData.length === 0 ? (
                <Typography
                  sx={{marginLeft: "1em"}}
                  onClick={() => {
                    setCurrentTab("Job Listings");
                  }}>
                  Create Job Listing!
                </Typography>
              ) : (
                <FormControl sx={{width: "80vw"}}>
                  <InputLabel id="job-listing">Job Listing</InputLabel>
                  <Select
                    labelId="job-listing"
                    id="job-listing"
                    autoWidth
                    sx={{width: "90vw"}}
                    label="JobListing"
                    value={activeJobListing ?? ""}
                    onChange={handleChange}>
                    {jobData.map((job, index) => (
                      <MenuItem
                        key={index}
                        value={job.jobListingId}
                        sx={{width: "90vw"}}>
                        {job.title} - {job.description.slice(0, 100)}... -{" "}
                        {job.location}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Paper>
        </Box>
      </Grid>
      {jobApplicationData &&
      Array.isArray(jobApplicationData) &&
      jobApplicationData.length > 0 ? (
        <Grid
          sx={{
            marginTop: "2em",
            overflow: "auto",
            overflowY: "scroll",
            height: "65vh",
            width: "100%",
          }}>
          {jobApplicationData.map((data, index) => (
            <Grid item xs={12} key={index} style={{marginTop: "1em"}}>
              <Card display={"flex"} justifyContent={"space-between"}>
                <Grid
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "1em",
                  }}>
                  <Typography
                    variant="h6"
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    {data.displayName}
                  </Typography>
                  <IconButton
                    onClick={() => handleExpandClick(data.jobApplicationId)}
                    aria-expanded={
                      expandedJobApplicationId === data.jobApplicationId
                    }
                    aria-label="show more">
                    <ExpandMore />
                  </IconButton>
                </Grid>
                <Collapse
                  in={expandedJobApplicationId === data.jobApplicationId}
                  timeout="auto"
                  unmountOnExit>
                  <Grid container sx={{height: "50vh", padding: "1em"}}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={3}
                      lg={2}
                      sx={{
                        borderRight: "1px solid gray",
                        padding: "1em",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}>
                      <Grid>
                        <Grid
                          onClick={() => {
                            setPdfContent("resume");
                          }}
                          sx={{
                            padding: "1em",
                            display: "flex",
                            cursor: "pointer",
                            justifyContent: "center",
                            border: "1px solid gray",
                            marginBottom: "1em",
                            borderRadius: "5px",
                            backgroundColor:
                              pdfContent === "resume" ? "#d3d3d3" : null,
                          }}>
                          <Typography>Resume</Typography>
                        </Grid>
                        <Grid
                          onClick={() => {
                            setPdfContent("coverLetter");
                          }}
                          sx={{
                            padding: "1em",
                            cursor: "pointer",
                            display: "flex",
                            justifyContent: "center",
                            border: "1px solid gray",
                            marginBottom: "1em",
                            borderRadius: "5px",
                            backgroundColor:
                              pdfContent === "coverLetter" ? "#d3d3d3" : null,
                          }}>
                          <Typography>Cover Letter</Typography>
                        </Grid>
                      </Grid>
                      <Grid>
                        {data.status === "Applied" ? (
                          <>
                            <Grid
                              onClick={() => {
                                handleAcceptApplication(data.jobApplicationId);
                              }}
                              sx={{
                                padding: "1em",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                                border: "1px solid green",
                                marginBottom: "1em",
                                borderRadius: "5px",
                              }}>
                              <Typography>Accept</Typography>
                            </Grid>
                            <Grid
                              onClick={() => {
                                handleRejectApplication(data.jobApplicationId);
                              }}
                              sx={{
                                padding: "1em",
                                cursor: "pointer",
                                display: "flex",
                                justifyContent: "center",
                                border: "1px solid red",
                                marginBottom: "1em",
                                borderRadius: "5px",
                              }}>
                              <Typography>Reject</Typography>
                            </Grid>
                          </>
                        ) : data.status === "Rejected" ? null : (
                          <Grid
                            onClick={() => {
                              setActiveJobApplicationId(data.jobApplicationId);
                              setCurrentTab("Interviews");
                            }}
                            sx={{
                              padding: "1em",
                              cursor: "pointer",
                              display: "flex",
                              justifyContent: "center",
                              border: "1px solid lightblue",
                              marginBottom: "1em",
                              borderRadius: "5px",
                            }}>
                            <Typography>Interview Details</Typography>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={9} lg={10} sx={{padding: "1em"}}>
                      {pdfContent !== null ? (
                        pdfContent === "resume" ? (
                          <iframe
                            src={data.resumeUrl}
                            width="100%"
                            height="100%"></iframe>
                        ) : (
                          <iframe
                            src={data.coverLetter}
                            width="100%"
                            height="100%"></iframe>
                        )
                      ) : null}
                    </Grid>
                  </Grid>
                </Collapse>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{padding: "1em"}}>
          No job applications available.
        </Typography>
      )}
    </Grid>
  );
};

export default JobApplication;
