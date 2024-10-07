import {styled, alpha} from "@mui/material/styles";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
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
import React, {useContext} from "react";
import axiosInstance from "../../api/axios";
import SpinnerLoader from "../spinner/SpinnerLoader";
import {ExpandMore} from "@mui/icons-material";
import {ThemeContext} from "../../contexts/ThemeContext";

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

const Popular = ({setCurrentTab, setJobApplication}) => {
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;
  const [loading, setLoading] = React.useState(true);
  const [jobData, setJobData] = React.useState([]);

  const [activeJobData, setActiveJobData] = React.useState([]);

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  React.useEffect(() => {
    const fetchdata = async () => {
      axiosInstance
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
      container
      spacing={{}}
      columns={{xs: 4, sm: 8, md: 12}}
      gap={3}
      sx={{
        overflow: "hidden",
        overflowY: "auto",
      }}>
      {jobData.map((data, index) => (
        <Card
          key={index}
          sx={{maxWidth: 330, cursor: "pointer"}}
          onClick={() => {
            setCurrentTab("Job Listings");
          }}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {data.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {data.description.substring(0, 200) + "..."}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{marginTop: "1em"}}>
              {data.jobType} - {data.location}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              ${data.salary} P.A
            </Typography>
          </CardContent>
        </Card>
        // <Grid item xs={4} sm={4} md={4} key={data.bannerId}>
        //   <ListItem>{data.title}</ListItem>
        // </Grid>
      ))}
    </Grid>
  );
};

export default Popular;
