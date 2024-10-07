import {styled} from "@mui/material/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Divider,
  Grid,
  Link,
  Paper,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import React, {useContext} from "react";
import axiosInstance from "../../api/axios";
import SpinnerLoader from "../spinner/SpinnerLoader";
import {ExpandMore} from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";
import {ThemeContext} from "../../contexts/ThemeContext";

const Search = styled("div")(({theme}) => ({
  position: "relative",
  borderRadius: 20,
  border:
    theme.palette.mode === "light" ? "1px solid black" : "1px solid white",
  marginLeft: 0,
}));

const SearchIconWrapper = styled("div")(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "20em",
      "&:focus": {
        width: "30em",
      },
    },
  },
}));

const Interview = ({setCurrentTab, setJobApplication}) => {
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;
  const [loading, setLoading] = React.useState(true);
  const [jobData, setJobData] = React.useState([]);
  const [activeJobData, setActiveJobData] = React.useState([]);
  const [applicationData, setApplicationData] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState("");
  const [expanded, setExpanded] = React.useState(null); // Change to store only the expanded card id

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id); // Toggle the card expansion
  };

  React.useEffect(() => {
    const fetchdata = async () => {
      await axiosInstance
        .post(
          "/JobListing/user/getall",
          {
            pageNumber: 1,
            pageSize: 200,
          },
          {withCredentials: true}
        )
        .then((res) => {
          setJobData(res.data.jobListing);
          setActiveJobData(() => {
            return res.data.jobListing.filter((job) => job.status === "Active");
          });
        })
        .catch((error) => {});

      await axiosInstance
        .post(
          "/JobApplication/user/get-applications",
          {pageNumber: 1, pageSize: 200},
          {
            withCredentials: true,
          }
        )
        .then(async (res) => {
          const updatedApplications = await Promise.all(
            res.data.jobApplication.map(async (element) => {
              try {
                const response = await axiosInstance.post(
                  `JobListing/get-listing/${element.jobListingId}`,
                  {},
                  {withCredentials: true}
                );
                element.jobListingId = response.data.jobListing;
              } catch (error) {
                console.error(
                  `Error fetching job listing for ID ${element.jobListingId}:`,
                  error
                );
              }
              return element;
            })
          );
          for (let i = 0; i < updatedApplications.length; i++) {
            await axiosInstance
              .get(
                `InterviewRound/user/get-interview-rounds/${updatedApplications[i].jobApplicationId}`,
                {
                  withCredentials: true,
                }
              )
              .then((res) => {
                updatedApplications[i].interviewRounds =
                  res.data.interviewRound;
              });
          }
          setApplicationData(updatedApplications);
          setLoading(false);
        })
        .catch((error) => {});
    };
    fetchdata();
  }, []);

  // Filter applicationData based on search input
  const filteredApplicationData = applicationData.filter((data) =>
    data.jobListingId.title.toLowerCase().includes(searchInput.toLowerCase())
  );

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
    <Grid style={{width: "100%"}}>
      <Paper elevation={2}>
        <Box sx={{flexGrow: 1}}>
          <Toolbar>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                display: {xs: "none", sm: "block"},
                fontFamily: "Poppins",
                FontWeight: "bold",
              }}>
              Interview Schedules
            </Typography>
            <Search colorTheme={colorTheme}>
              <SearchIconWrapper>
                <SearchIcon
                  style={{color: colorTheme === "light" ? "black" : "white"}}
                />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{"aria-label": "search"}}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)} // Update search input
              />
            </Search>
          </Toolbar>
        </Box>
      </Paper>

      <Grid
        sx={{
          marginTop: "2em",
          overflow: "auto",
          overflowY: "scroll",
          height: "75vh",
        }}>
        {filteredApplicationData.map((data, index) => (
          <Grid item xs={12} key={index} style={{marginTop: "1em"}}>
            <Card>
              <Grid display={"flex"} justifyContent={"space-between"}>
                <CardContent>
                  <Typography variant="h6">
                    {data.jobListingId.title} - {data.jobListingId.jobType}
                  </Typography>
                  <Typography variant="body1">{data.status}</Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Typography variant="body1">
                    {data.jobListingId.location}
                  </Typography>
                  <IconButton
                    onClick={() => handleExpandClick(data.jobApplicationId)} // Pass unique id for each card
                    aria-expanded={expanded === data.jobApplicationId} // Check if the current card is expanded
                    aria-label="show more">
                    <ExpandMore />
                  </IconButton>
                </CardActions>
              </Grid>
              <Collapse
                in={expanded === data.jobApplicationId}
                timeout="auto"
                unmountOnExit>
                <CardContent
                  sx={{
                    borderTop: "1px solid gray",
                  }}>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontStyle: "italic",
                      }}>
                      {data.jobListingId.description}
                    </Typography>
                    <Typography variant="body1">
                      ${data.jobListingId.salary}
                    </Typography>
                  </Grid>
                  <Grid
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      marginTop: "1em",
                    }}>
                    {data.interviewRounds.map((round, idx) => {
                      return (
                        <React.Fragment key={idx}>
                          <Grid
                            sx={{
                              borderLeft: "1px solid gray",
                              height: "3vh",
                              marginLeft: "3px",
                            }}></Grid>

                          <Typography
                            variant="body1"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                            }}>
                            <CircleIcon
                              color="black"
                              sx={{
                                width: ".3em",
                                marginRight: "1em",
                              }}
                            />{" "}
                            <Typography
                              sx={{
                                width: "15%",
                              }}>
                              {round.roundName} -{" "}
                            </Typography>
                            {round.status === "Scheduled" ? (
                              "Recruiters Might Update The details , Check Mail!"
                            ) : (
                              <Grid
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}>
                                <Grid>
                                  <Link
                                    sx={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      window.open(round.roundLink, "_blank");
                                    }}>
                                    {round.roundLink}{" "}
                                  </Link>
                                  - {new Date(round.date).toDateString()}
                                  {" - "}
                                  {new Date(round.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}{" "}
                                </Grid>
                                <Grid>
                                  <Typography
                                    sx={{
                                      fontStyle: "italic",
                                    }}>
                                    {round.description}
                                  </Typography>
                                </Grid>
                              </Grid>
                            )}
                          </Typography>
                        </React.Fragment>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Collapse>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Interview;
