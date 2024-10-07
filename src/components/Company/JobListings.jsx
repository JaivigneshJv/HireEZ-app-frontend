import {styled} from "@mui/material/styles";
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
import SearchIcon from "@mui/icons-material/Search";
import React, {useContext} from "react";
import axiosInstance from "../../api/axios";
import SpinnerLoader from "../spinner/SpinnerLoader";
import {ExpandMore} from "@mui/icons-material";
import {ThemeContext} from "../../contexts/ThemeContext";
import AddIcon from "@mui/icons-material/Add";

const Search = styled("div")(({theme}) => ({
  position: "relative",
  borderRadius: 20,
  border: theme === "light" ? "1px solid black" : "1px solid white",
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

const JobListing = ({
  setCurrentTab,
  setJobApplication,
  setActiveJobListingId,
}) => {
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;
  const [loading, setLoading] = React.useState(true);
  const [jobData, setJobData] = React.useState([]);
  const [searchInput, setSearchInput] = React.useState("");
  const [expanded, setExpanded] = React.useState(null); // Store the ID of the expanded card

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id); // Toggle the expansion of the selected card
  };

  React.useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axiosInstance.get("/JobListing/company/getall", {
          withCredentials: true,
        });
        setJobData(res.data.jobListing);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job listings:", error);
      }
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

  // Filter jobData based on the search input
  const filteredJobData = jobData.filter((job) =>
    job.title.toLowerCase().includes(searchInput.toLowerCase())
  );

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
              JOB LISTINGS
            </Typography>
            <Search theme={{colorTheme}}>
              <SearchIconWrapper>
                <SearchIcon
                  style={{color: colorTheme === "light" ? "black" : "white"}}
                />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{"aria-label": "search"}}
                value={searchInput} // Bind search input value
                onChange={(e) => setSearchInput(e.target.value)} // Update search input
              />
            </Search>
          </Toolbar>
        </Box>
      </Paper>
      <Paper
        elevation={2}
        onClick={() => {
          setCurrentTab("New Job");
        }}>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            marginTop: "1em",
            padding: "1em",
            cursor: "pointer",
          }}>
          <AddIcon />
          <Typography sx={{marginLeft: "1em"}}>Create Listing</Typography>
        </Box>
      </Paper>

      <Grid
        sx={{
          marginTop: "2em",
          overflow: "auto",
          overflowY: "scroll",
          height: "65vh",
        }}>
        {filteredJobData.map((data, index) => (
          <Grid item xs={12} key={index} style={{marginTop: "1em"}}>
            <Card>
              <Grid display={"flex"} justifyContent={"space-between"}>
                <CardContent>
                  <Typography variant="h6">{data.title}</Typography>
                  <Typography variant="body1">{data.location}</Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton
                    onClick={() => handleExpandClick(data.jobListingId)} // Pass the unique jobListingId for the card
                    aria-expanded={expanded === data.jobListingId} // Check if this card is expanded
                    aria-label="show more">
                    <ExpandMore />
                  </IconButton>
                </CardActions>
              </Grid>
              <Collapse
                in={expanded === data.jobListingId}
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
                      {data.description}
                    </Typography>
                    <Typography variant="body1">
                      ${data.salary} ({data.jobType})
                    </Typography>
                  </Grid>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "1em",
                    }}>
                    <Typography variant="body1">
                      Deadline -{" "}
                      {new Date(data.applicationDeadline).toDateString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "italic",
                      }}>
                      Rounds - {data.roundNames}
                    </Typography>
                    <Grid>
                      <Button
                        sx={{
                          marginRight: "1em",
                        }}
                        variant="outlined"
                        onClick={() => {
                          setActiveJobListingId(data.jobListingId);
                          setJobApplication(data);
                          setCurrentTab("Job Applications");
                        }}>
                        Applications
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setCurrentTab("Apply Job");
                          setJobApplication(data);
                        }}>
                        Update
                      </Button>
                    </Grid>
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

export default JobListing;
