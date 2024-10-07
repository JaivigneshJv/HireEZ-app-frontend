import React, {useEffect, useState} from "react";
import axiosInstance from "../../api/axios";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import SpinnerLoader from "../spinner/SpinnerLoader";

const Interviews = ({activeJobApplicationId}) => {
  // Destructure props
  const [loading, setLoading] = useState(false);
  const [interviewRound, setInterviewRound] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedRound, setSelectedRound] = useState({});
  const [open, setOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const snackBar = (snackbarText) => {
    setSnackbarText(snackbarText);
    setOpen(true);
  };
  const [formData, setFormData] = useState({
    description: "",
    date: "",
    roundLink: "",
    status: "",
  });

  useEffect(() => {
    axiosInstance
      .get(
        `InterviewRound/company/get-interview-rounds/${activeJobApplicationId}`,
        {withCredentials: true}
      )
      .then((res) => {
        const sortedRounds = res.data.interviewRound.sort((a, b) => {
          if (!a.date) return 1;
          if (!b.date) return -1;
          return new Date(a.date) - new Date(b.date);
        });
        setInterviewRound(sortedRounds);
        setLoading(false);
      });
  }, [activeJobApplicationId]);

  const handleOpenModal = (type, round) => {
    setModalType(type);
    setSelectedRound(round);
    setFormData({
      description: round.description || "",
      date: round.date || "",
      roundLink: round.roundLink || "",
      status: round.status || "",
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({...prevData, [name]: value}));
  };

  const handleSubmit = () => {
    setLoading(true);
    if (modalType === "updateDetails") {
      axiosInstance
        .post(
          `InterviewRound/company/update-round`,
          {
            interviewRoundId: selectedRound.interviewRoundId,
            description: formData.description,
            date: formData.date,
            roundLink: formData.roundLink,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          snackBar("Round details updated successfully.");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
    } else if (modalType === "updateStatus") {
      axiosInstance
        .post(
          `InterviewRound/company/update-round-status`,
          {
            interviewRoundId: selectedRound.interviewRoundId,
            status: formData.status,
          },
          {
            withCredentials: true,
          }
        )
        .then(() => {
          snackBar("Round status updated successfully.");
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        });
    }
    handleCloseModal();
  };

  const filteredInterviewRounds = interviewRound.filter((round) =>
    round.roundName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{minHeight: "100vh"}}>
        <SpinnerLoader />
        <Snackbar open={open} autoHideDuration={5000} message={snackbarText} />
      </Grid>
    );
  }

  return (
    <Grid container>
      <Grid item xs={12} style={{marginBottom: "1em"}}>
        <TextField
          label="Search Interview Rounds"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Grid>
      {filteredInterviewRounds.map((data, index) => (
        <Grid item xs={12} key={index} style={{marginTop: "1em"}}>
          <Card>
            <Grid
              sx={{
                padding: "1em",
                display: "flex",
                justifyContent: "space-between",
              }}>
              <Grid>
                <Typography variant="h6">{data.roundName}</Typography>
                {data.status !== "Scheduled" && (
                  <>
                    <Typography variant="body2">{data.description}</Typography>
                  </>
                )}
              </Grid>
              <Grid>
                {data.status !== "Scheduled" && (
                  <>
                    <Typography
                      variant="body2"
                      sx={{
                        fontStyle: "italic",
                      }}>
                      {data.roundLink}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        marginTop: "1em",
                      }}>
                      {new Date(data.date).toDateString()}
                    </Typography>
                  </>
                )}
              </Grid>
            </Grid>
            <CardActions
              sx={{
                padding: "1em",
              }}>
              <Grid
                sx={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                }}>
                <Typography variant="body2">{data.status}</Typography>
                <Grid>
                  {data.status === "Scheduled" ? (
                    <Button
                      onClick={() => handleOpenModal("updateDetails", data)}>
                      Update Round Details
                    </Button>
                  ) : data.status === "Completed" ? (
                    <Button disabled>Completed</Button>
                  ) : data.status === "InterviewScheduled" ? (
                    <Button
                      onClick={() => handleOpenModal("updateStatus", data)}>
                      On-Progress
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleOpenModal("updateStatus", data)}>
                      Update Results
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardActions>
          </Card>
        </Grid>
      ))}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {modalType === "updateDetails"
            ? "Update Round Details"
            : "Update Round Status"}
        </DialogTitle>
        <DialogContent>
          {modalType === "updateDetails" ? (
            <>
              <DialogContentText>
                Update the details of the interview round:
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                name="description"
                label="Description"
                type="text"
                fullWidth
                value={formData.description}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="date"
                type="datetime-local"
                fullWidth
                value={formData.date}
                onChange={handleInputChange}
              />
              <TextField
                margin="dense"
                name="roundLink"
                label="Round Link"
                type="text"
                fullWidth
                value={formData.roundLink}
                onChange={handleInputChange}
              />
            </>
          ) : (
            <>
              <DialogContentText>
                Update the status of the interview round:
              </DialogContentText>
              <FormControl fullWidth margin="dense">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status">
                  <MenuItem value="Rejected">Rejected</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={open} autoHideDuration={5000} message={snackbarText} />
    </Grid>
  );
};

export default Interviews;
