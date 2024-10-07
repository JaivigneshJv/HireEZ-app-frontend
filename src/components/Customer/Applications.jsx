import {styled, alpha} from "@mui/material/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
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
import React, {useContext, useState} from "react";
import axiosInstance from "../../api/axios";
import SpinnerLoader from "../spinner/SpinnerLoader";
import {ExpandMore} from "@mui/icons-material";
import {ThemeContext} from "../../contexts/ThemeContext";

const Search = styled("div")(({theme}) => ({
  position: "relative",
  borderRadius: 20,
  border:
    theme.palette.mode === "light" ? "1px solid black" : "1px solid white",
  "&:hover": {},
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
    // vertical padding + font size from searchIcon
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

const Applications = ({setCurrentTab, setJobApplication}) => {
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState([]);
  const [activeJobData, setActiveJobData] = useState([]);
  const [applicationData, setApplicationData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCard, setExpandedCard] = useState(null);

  const handleExpandClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredApplications = applicationData.filter(
    (data) =>
      data.jobListingId.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      data.jobListingId.location
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

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
          setApplicationData(updatedApplications);
          setLoading(false);
        })
        .catch((error) => {});
    };
    fetchdata();
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
                fontWeight: "bold",
              }}>
              Job Applications
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
                value={searchQuery}
                onChange={handleSearchChange}
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
        {filteredApplications.map((data, index) => (
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
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expandedCard === index}
                    aria-label="show more">
                    <ExpandMore />
                  </IconButton>
                </CardActions>
              </Grid>
              <Collapse
                in={expandedCard === index}
                timeout="auto"
                unmountOnExit>
                <CardContent sx={{borderTop: "1px solid gray"}}>
                  <Grid sx={{display: "flex", justifyContent: "space-between"}}>
                    <Typography variant="body1" sx={{fontStyle: "italic"}}>
                      {data.jobListingId.description}
                    </Typography>
                    <Typography variant="body1">
                      ${data.jobListingId.salary}
                    </Typography>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1em",
                    }}>
                    <Typography variant="body1">
                      Applied Date -{" "}
                      {new Date(data.applicationDate).toDateString()}
                    </Typography>
                    <Typography variant="body1">
                      {data.status === "InterviewScheduled" ? (
                        <Grid>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setCurrentTab("Interview");
                            }}>
                            Get Status
                          </Button>
                        </Grid>
                      ) : (
                        <Typography sx={{}}>{data.status}</Typography>
                      )}
                    </Typography>
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

export default Applications;
