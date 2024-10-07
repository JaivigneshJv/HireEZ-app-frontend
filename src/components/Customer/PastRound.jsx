import {styled, alpha} from "@mui/material/styles";
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
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import CircleIcon from "@mui/icons-material/Circle";
import {ThemeContext} from "../../contexts/ThemeContext";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
const Search = styled("div")(({theme}) => ({
  position: "relative",
  borderRadius: 20,
  border: theme === "light" ? "1px solid black" : "1px solid white",
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

const PastRound = ({setCurrentTab, setJobApplication}) => {
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;
  const [loading, setLoading] = React.useState(true);
  const [jobData, setJobData] = React.useState([]);
  const [activeJobData, setActiveJobData] = React.useState([]);
  const [applicationData, setApplicationData] = React.useState([]);
  const [pastRounds, setPastRounds] = React.useState([]);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
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
          const filteredInterviewRounds = updatedApplications.flatMap(
            (application) =>
              application.interviewRounds.filter(
                (round) =>
                  round.status === "Completed" || round.status === "Rejected"
              )
          );
          setApplicationData(updatedApplications);

          setPastRounds(filteredInterviewRounds);
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
    <Grid
      style={{
        width: "100%",
      }}>
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
              Past Rounds
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
              />
            </Search>
          </Toolbar>
        </Box>
      </Paper>

      <Grid
        container
        spacing={{}}
        columns={{xs: 4, sm: 8, md: 12}}
        gap={3}
        sx={{
          marginTop: "2em",
          overflow: "auto",
          overflowY: "scroll",
        }}>
        {pastRounds.map((data, index) => (
          <Card
            key={data.interviewRoundId}
            sx={{
              maxWidth: 330,
              cursor: "pointer",
              alignItems: "center",
              display: "flex",
            }}>
            <CardContent sx={{}}>
              <Typography
                variant="h6"
                component="div"
                sx={{alignItems: "center", display: "flex"}}>
                {data.roundName}
                {data.status === "Completed" ? (
                  <>
                    <CheckCircleOutlineIcon
                      sx={{
                        marginLeft: ".5em",
                      }}
                    />
                  </>
                ) : null}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.8em",
                  fontStyle: "italic",
                }}>
                {data.description} - {data.roundLink}
                {data.status === "Completed" ? null : null}
              </Typography>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}>
                <Typography
                  sx={{
                    display: "flex",
                    textAlign: "right",
                  }}>
                  {data.status}
                </Typography>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};

export default PastRound;
