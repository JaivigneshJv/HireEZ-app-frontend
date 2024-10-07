import React, {useContext, useState, useEffect} from "react";
import {styled, alpha} from "@mui/material/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  Grid,
  Paper,
  Box,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
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

const JobListing = ({setCurrentTab, setJobApplication}) => {
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState([]);
  const [activeJobData, setActiveJobData] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleExpandClick = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.post(
          "/JobListing/user/getall",
          {
            pageNumber: 1,
            pageSize: 200,
          },
          {withCredentials: true}
        );
        setJobData(() => {
          return res.data.jobListing.filter((job) => job.status === "Approved");
        });
        setActiveJobData(() => {
          return res.data.jobListing.filter((job) => job.status === "Active");
        });
        setLoading(false);
      } catch (error) {
        // Handle error
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

  const filteredJobData = jobData.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
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
                fontWeight: "bold",
              }}>
              JOB LISTINGS
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
                onChange={handleSearch}
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
        {filteredJobData.length === 0 && (
          <Grid>
            <Typography variant="h6" align="center">
              No Jobs Found
            </Typography>
          </Grid>
        )}
        {filteredJobData.map((data, index) => (
          <Grid item xs={12} key={index} style={{marginTop: "1em"}}>
            <Card>
              <Grid display={"flex"} justifyContent={"space-between"}>
                <CardContent>
                  <Typography variant="h6">{data.title}</Typography>
                  <Typography variant="body1">{data.jobType}</Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <Typography variant="body1">{data.location}</Typography>
                  <IconButton
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expanded === index}
                    aria-label="show more">
                    <ExpandMore />
                  </IconButton>
                </CardActions>
              </Grid>
              <Collapse in={expanded === index} timeout="auto" unmountOnExit>
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
                      DeadLine -{" "}
                      {new Date(data.applicationDeadline).toDateString()}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "italic",
                      }}>
                      Rounds - {data.roundNames}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setCurrentTab("Apply Job");
                        setJobApplication(data);
                      }}>
                      Apply
                    </Button>
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
