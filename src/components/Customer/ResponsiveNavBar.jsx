import * as React from "react";
import {useState, useContext} from "react";
import {styled, useTheme} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Logo from "../../assets/images/logo2.png";
import {Avatar, Button, Grid, Menu, MenuItem, Tooltip} from "@mui/material";

import StadiumIcon from "@mui/icons-material/Stadium";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";

import ClearAllIcon from "@mui/icons-material/ClearAll";
import BusinessIcon from "@mui/icons-material/Business";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";

import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import Home from "./Home";
import Feed from "./Feed";
import Dashboard from "./Dashboard";
import Trending from "./Trending";
import Community from "./Community";

import JobListing from "./JobListing";
import ApplyJob from "./ApplyJob";

import Company from "./Company";
import Popular from "./Popular";

import Applications from "./Applications";
import Interview from "./Interview";
import PastRound from "./PastRound";

import Reports from "./Reports";

import axiosInstance from "../../api/axios";
import {Navigate} from "react-router-dom";
import UserProfile from "../../pages/UserProfiles/UserProfile";
import {ThemeContext} from "../../contexts/ThemeContext";
import ThemeToggleButton from "../../components/theme/ThemeToggleButton";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({theme, open}) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function ResponsiveNabBar({user, userData}) {
  const [jobApplication, setJobApplication] = useState(null);

  const [currentTab, setCurrentTab] = useState("Feed");
  const settings = ["Profile", "Logout"];
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  React.useEffect(() => {
    if (currentTab === "Logout") {
      handleLogout();
    }
  }, [currentTab]);
  const handleLogout = async () => {
    await axiosInstance
      .post("/Auth/logout", {}, {withCredentials: true})
      .then((res) => {
        window.location.reload();

        return <Navigate to="/dashboard" />;
      })
      .catch((err) => {});
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleDrawerOpen = () => {
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const DrawerIcons1 = [
    <DynamicFeedIcon />,
    <StadiumIcon />,
    <DashboardIcon />,
    <TrendingUpIcon />,
    <PeopleIcon />,
  ];

  const DrawerIcons2 = [
    <ClearAllIcon />,
    <BusinessIcon />,
    <AutoAwesomeIcon />,
  ];

  const DrawerIcons3 = [
    <MenuOpenIcon />,
    <RecordVoiceOverIcon />,
    <ManageHistoryIcon />,
  ];

  const DrawerIcons4 = [
    <FlagCircleIcon />,
    <PersonPinIcon />,
    <ExitToAppIcon />,
  ];
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;
  return (
    <Grid
      sx={{
        height: "100vh",
        backgroundColor: colorTheme === "light" ? "#f5f5f5" : "#1c1a1a",
        color: "white",
      }}>
      <Box
        sx={{
          display: "flex",
          overflow: "hidden",
        }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            backgroundColor: colorTheme === "light" ? "#f5f5f5" : "black",
          }}>
          <Toolbar>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center",
                width: "100%",
              }}>
              <Grid
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  alignContent: "center",
                }}>
                <IconButton
                  color="black"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start">
                  <MenuIcon />
                </IconButton>
                <img
                  src={Logo}
                  alt=""
                  onClick={() => {
                    setCurrentTab("Feed");
                  }}
                  style={{
                    width: "120px",
                    marginLeft: ".25em",
                    cursor: "pointer",
                  }}
                />
              </Grid>
              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "2em",
                }}>
                <Box
                  sx={{
                    flexGrow: 1,
                    display: {
                      xs: "none",
                      md: "flex",
                      gap: "1em",
                      justifyContent: "center",
                      alignItems: "center",
                    },
                  }}>
                  {/* {settings.map((page) => (
                    <Button
                      key={page}
                      onClick={() => {
                        if (page === "Profile") {
                          setCurrentTab("Profile");
                        }
                      }}
                      sx={{my: 2, display: "block"}}>
                      {page}
                    </Button>
                  ))} */}
                  <ThemeToggleButton />
                  <Divider orientation="vertical" flexItem sx={{}} />
                  <Typography
                    sx={{
                      color: colorTheme === "light" ? "black" : "white",
                    }}>
                    {userData.username}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    justifyContent: "center",
                    display: "flex",
                    justifySelf: "center",
                    alignSelf: "center",
                    alignItems: "center",
                  }}>
                  <Tooltip
                    title={userData.username}
                    sx={{
                      display: {xs: "block", md: "none"},
                    }}>
                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                      <Avatar
                        alt={userData.username}
                        onClick={() => {
                          setCurrentTab("Profile");
                        }}
                        src={
                          user.profilePictureUrl === ""
                            ? null
                            : user.profilePictureUrl
                        }
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{mt: "45px", display: {xs: "block", md: "none"}}}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}>
                    {/* {settings.map((setting) => (
                      <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))} */}
                  </Menu>
                </Box>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <Grid
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              justifyContent: "space-between",
            }}>
            <Grid>
              <List>
                {[
                  "Feed",
                  "Events",
                  //  "Dashboard",
                  //  "Trending",
                  //  "Community"
                ].map((text, index) => (
                  <ListItem
                    key={text}
                    disablePadding
                    sx={{display: "block"}}
                    onClick={() => {
                      setCurrentTab(text);
                    }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}>
                        {DrawerIcons1[index]}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        sx={{opacity: open ? 1 : 0}}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {["Job Listings", "Comapany's", "Popular"].map(
                  (text, index) => (
                    <ListItem
                      key={text}
                      disablePadding
                      sx={{display: "block"}}
                      onClick={() => {
                        setCurrentTab(text);
                      }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}>
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}>
                          {DrawerIcons2[index]}
                        </ListItemIcon>
                        <ListItemText
                          primary={text}
                          sx={{opacity: open ? 1 : 0}}
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                )}
              </List>
              <Divider />
              <List>
                {["Applications", "Interview", "Past Rounds"].map(
                  (text, index) => (
                    <ListItem
                      key={text}
                      disablePadding
                      sx={{display: "block"}}
                      onClick={() => {
                        setCurrentTab(text);
                      }}>
                      <ListItemButton
                        sx={{
                          minHeight: 48,
                          justifyContent: open ? "initial" : "center",
                          px: 2.5,
                        }}>
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 3 : "auto",
                            justifyContent: "center",
                          }}>
                          {DrawerIcons3[index]}
                        </ListItemIcon>
                        <ListItemText
                          primary={text}
                          sx={{opacity: open ? 1 : 0}}
                        />
                      </ListItemButton>
                    </ListItem>
                  )
                )}
              </List>
              <Divider />
            </Grid>
            <Grid>
              <Divider />
              <List>
                {["Reports", "Profile", "Logout"].map((text, index) => (
                  <ListItem
                    key={text}
                    disablePadding
                    sx={{display: "block"}}
                    onClick={() => {
                      setCurrentTab(text);
                    }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? "initial" : "center",
                        px: 2.5,
                      }}>
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : "auto",
                          justifyContent: "center",
                        }}>
                        {DrawerIcons4[index]}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        sx={{opacity: open ? 1 : 0}}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            display: "flex",
            marginTop: "75px",
          }}>
          <DrawerHeader />
          {currentTab === "Events" ? <Home /> : null}
          {currentTab === "Feed" ? (
            <Feed user={user} userData={userData} />
          ) : null}
          {currentTab === "Dashboard" ? <Dashboard /> : null}
          {currentTab === "Trending" ? <Trending /> : null}
          {currentTab === "Community" ? <Community /> : null}
          {currentTab === "Job Listings" ? (
            <JobListing
              setCurrentTab={setCurrentTab}
              setJobApplication={setJobApplication}
            />
          ) : null}
          {currentTab === "Comapany's" ? <Company /> : null}
          {currentTab === "Popular" ? (
            <Popular
              setCurrentTab={setCurrentTab}
              setJobApplication={setJobApplication}
            />
          ) : null}
          {currentTab === "Applications" ? (
            <Applications
              setCurrentTab={setCurrentTab}
              setJobApplication={setJobApplication}
            />
          ) : null}
          {currentTab === "Interview" ? <Interview /> : null}
          {currentTab === "Past Rounds" ? <PastRound /> : null}
          {currentTab === "Reports" ? <Reports /> : null}
          {currentTab === "Profile" ? <UserProfile /> : null}
          {currentTab === "Apply Job" ? (
            <ApplyJob jobListing={jobApplication} />
          ) : null}
        </Box>
      </Box>
    </Grid>
  );
}
