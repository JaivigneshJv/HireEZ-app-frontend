import React, {useContext, useEffect, useState} from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  Fab,
  Modal,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import InfiniteScroll from "react-infinite-scroll-component";
import {ThemeContext} from "../../contexts/ThemeContext";
import SpinnerLoader from "../spinner/SpinnerLoader";
import axiosInstance from "../../api/axios";

const Feed = ({user, userData}) => {
  const themeContext = useContext(ThemeContext);
  const colorTheme = themeContext.theme.palette.mode;

  const [value, setValue] = useState("");
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/Post/get-all?PageNumber=${page}&PageSize=10`,
        {withCredentials: true}
      );
      if (response.data.posts.length > 0) {
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
        setPage(page + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    try {
      const newPost = {
        userName: userData.username,
        userProfilePcitureUrl: user.profilePictureUrl,
        content: value,
        imageUrls: "string",
      };
      await axiosInstance.post("/Post/create", newPost, {
        withCredentials: true,
      });
      setOpen(false);
      setValue("");
      setPage(1);
      setPosts([]);
      setHasMore(true);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
        overflow: "hidden",
        overflowY: "scroll",
      }}>
      <Grid
        item
        xs={12}
        sm={10}
        md={8}
        lg={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
        }}>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<SpinnerLoader />}
          endMessage={
            <Typography
              sx={{
                color: colorTheme === "light" ? "black" : "white",
                padding: "1em",
                textAlign: "center",
              }}>
              End of feed
            </Typography>
          }
          style={{width: "100%"}}>
          {posts.map((post, index) => (
            <Paper key={index} elevation={3} sx={{padding: 2, marginBottom: 2}}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 2,
                }}>
                <Avatar src={post.userProfilePcitureUrl} alt={post.userName} />
                <Typography variant="h6" sx={{marginLeft: 2}}>
                  {post.userName}
                </Typography>
              </Box>
              <Box dangerouslySetInnerHTML={{__html: post.content}} />
              <Typography variant="body2" color="textSecondary">
                {new Date(post.datePosted).toLocaleString()}
              </Typography>
            </Paper>
          ))}
        </InfiniteScroll>
      </Grid>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}>
          <ReactQuill
            theme={colorTheme === "light" ? "snow" : "snow"}
            value={value}
            style={{
              width: "100%",
              height: "200px",
            }}
            onChange={setValue}
          />
          <Grid
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 2,
            }}>
            <Button
              sx={{
                marginTop: "4em",
              }}
              variant="contained"
              color="primary"
              onClick={createPost}>
              Post
            </Button>
            <Button
              sx={{
                marginTop: "4em",
              }}
              variant="outlined"
              color="secondary"
              onClick={handleClose}>
              Cancel
            </Button>
          </Grid>
        </Box>
      </Modal>
    </Grid>
  );
};

export default Feed;
