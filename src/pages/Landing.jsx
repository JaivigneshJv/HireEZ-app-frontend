import React, {useContext} from "react";
import {Box, Typography, Button, Grid, AppBar, Toolbar} from "@mui/material";
import {styled} from "@mui/system";
import {ThemeProvider, createTheme} from "@mui/material/styles";
import {ThemeContext} from "../contexts/ThemeContext";
import LandingLogo from "../assets/images/Landing.png";
import {Navigate, useNavigate} from "react-router-dom";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";

import Logo1 from "../assets/images/ImageGrid/1.jpg";
import Logo2 from "../assets/images/ImageGrid/2.jpg";
import Logo3 from "../assets/images/ImageGrid/3.jpg";
import Logo4 from "../assets/images/ImageGrid/4.jpg";
import Logo5 from "../assets/images/ImageGrid/5.jpg";
import Logo6 from "../assets/images/ImageGrid/6.jpg";
import Logo7 from "../assets/images/ImageGrid/7.jpg";
import Logo8 from "../assets/images/ImageGrid/8.jpg";
import Logo9 from "../assets/images/ImageGrid/9.jpg";
import Logo10 from "../assets/images/ImageGrid/10.jpg";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f0f4f8",
      paper: "#fff",
    },
    text: {
      primary: "#000",
    },
  },
  typography: {
    fontFamily: "Syne, Arial",
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#121212",
      paper: "#1d1d1d",
    },
    text: {
      primary: "#fff",
    },
  },
  typography: {
    fontFamily: "Syne, Arial",
  },
});

const Root = styled("div")(({theme}) => ({
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  paddingBottom: "50px",
}));

const HeroSection = styled(Box)(({theme}) => ({
  backgroundColor: theme.palette.background.paper,
  padding: "50px 20px",
}));

const HeroTitle = styled(Typography)(({theme}) => ({
  fontSize: "4rem",
  fontWeight: "700",
  marginBottom: "20px",
  color: theme.palette.text.primary,
}));

const HeroSubtitle = styled(Typography)(({theme}) => ({
  fontSize: "1rem",
  marginBottom: "40px",
  color: theme.palette.text.primary,
}));

const FeatureSection = styled(Box)(({theme}) => ({
  backgroundColor: "#2b4b6f",
  color: theme.palette.text.primary,
  padding: "50px 20px",
}));

const FeatureTitle = styled(Typography)(({theme}) => ({
  fontSize: "2rem",
  fontWeight: "700",
  marginBottom: "20px",
  color: theme.palette.text.primary,
}));

const CallToActionSection = styled(Box)(({theme}) => ({
  backgroundColor: "#5b7ea7",
  color: theme.palette.text.primary,
  padding: "50px 20px",
}));

const Footer = styled(Box)(({theme}) => ({
  backgroundColor: "#5b7ea7",
  color: theme.palette.text.primary,
  padding: "20px 0",
}));

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

const Landing = () => {
  const navigation = useNavigate();
  const themeContext = useContext(ThemeContext);
  const currentTheme = themeContext.theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <Root>
        <AppBar
          position="static"
          sx={{
            backgroundColor:
              themeContext.theme.palette.mode === "light" ? "#fff" : "#121212",
            color:
              themeContext.theme.palette.mode === "light" ? "#000" : "#fff",
          }}>
          <Toolbar>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}>
              <Grid>
                <Typography variant="h6" component="div">
                  HIREEZ
                </Typography>
              </Grid>
              <Grid>
                <Button color="inherit">Home</Button>
                <Button color="inherit">About</Button>
                <Button color="inherit">Features</Button>
                <Button
                  color="inherit"
                  onClick={() => {
                    <Navigate to={"/login"} />;
                    navigation("/login");
                  }}>
                  Login
                </Button>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <HeroSection
          sx={
            {
              // backgroundImage: "linear-gradient(to right, #2b4b6f, #5b7ea7)",
            }
          }>
          <HeroTitle
            sx={{
              fontSize: "15vw",
            }}>
            HIREEZ
          </HeroTitle>
          <HeroSubtitle
            sx={{
              fontSize: "3vw",
            }}>
            Reaching Out To Your Destiny With Us
          </HeroSubtitle>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: "1vw",
                }}>
                Stepping up in your chosen field just got easier! With HIREez,
                we are all about connecting talent with opportunity. Whether
                you're a job seeker on a quest for your dream career, or an
                employer hunting for that perfect fit for your team, we've got
                you covered.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                sx={{
                  fontSize: "1vw",
                }}>
                Our platform is packed with features designed to make your job
                search or hiring process a breeze. From a diverse range of job
                listings to detailed company profiles, HIREez is your one-stop
                shop for all things job related.
              </Typography>
            </Grid>
          </Grid>
        </HeroSection>

        <FeatureSection>
          <FeatureTitle
            sx={{fontSize: "3vw", marginBottom: "1em", color: "white"}}>
            Experience Versatile Opportunities With Us
          </FeatureTitle>
          <Grid
            container
            spacing={3}
            sx={{
              display: "flex",
              justifyContent: "center ",
            }}>
            <ImageList
              sx={{width: "80vh", height: "90vh"}}
              variant="quilted"
              cols={4}
              rowHeight={121}>
              {itemData.map((item) => (
                <ImageListItem
                  key={item.img}
                  cols={item.cols || 1}
                  rows={item.rows || 1}>
                  <img
                    {...srcset(item.img, 121, item.rows, item.cols)}
                    alt={item.title}
                    loading="lazy"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </Grid>
        </FeatureSection>

        <CallToActionSection
          sx={{
            height: "70vh",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}>
          {/* <img src={LandingLogo} alt="" /> */}

          <Typography
            sx={{
              fontSize: "3vw",
            }}
            variant="h4"
            component="div"
            gutterBottom>
            Ready To Dive In?
          </Typography>
          <Typography
            sx={{
              fontSize: "1",
            }}
            variant="body1"
            component="div"
            gutterBottom>
            Experience the power of HIREez today. It's time to step towards your
            dream job or ideal candidate with us. You're no more steps away from
            success. So what are you waiting for?
          </Typography>
          <Button
            variant="outlined"
            sx={{
              marginTop: "2em",
              borderColor: "black",
              color: "black",
              ":hover": {
                backgroundColor: "black",
                borderColor: "black",
                color: "white",
              },
            }}
            onClick={() => {
              <Navigate to={"/login"} />;
              navigation("/register");
            }}>
            Get Started Now
          </Button>
        </CallToActionSection>

        <Footer
          sx={{
            backgroundColor:
              themeContext.theme.palette.mode === "light" ? "#fff" : "#121212",
            color:
              themeContext.theme.palette.mode === "light" ? "#000" : "#fff",
          }}>
          <Typography variant="body2" component="div">
            © 2024 HIREez Inc. All rights reserved.
          </Typography>
          <Box sx={{mt: 1}}>
            <Button color="inherit">Twitter</Button>
            <Button color="inherit">Instagram</Button>
            <Button color="inherit">Facebook</Button>
            <Button color="inherit">Twitch</Button>
          </Box>
        </Footer>
      </Root>
    </ThemeProvider>
  );
};

export default Landing;

const itemData = [
  {
    img: Logo1,
    title: "Breakfast",
    rows: 2,
    cols: 2,
  },
  {
    img: Logo2,
    title: "Burger",
  },
  {
    img: Logo3,
    title: "Camera",
  },
  {
    img: Logo4,
    title: "Coffee",
    cols: 2,
  },
  {
    img: Logo5,
    title: "Hats",
    cols: 2,
  },
  {
    img: Logo6,
    title: "Honey",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
  },
  {
    img: Logo7,
    title: "Basketball",
  },
  {
    img: Logo8,
    title: "Fern",
  },
  {
    img: Logo9,
    title: "Mushrooms",
    rows: 2,
    cols: 2,
  },
  {
    img: Logo10,
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    cols: 2,
  },
];
