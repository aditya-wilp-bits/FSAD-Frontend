"use client"

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Divider,
  Grid,
  CircularProgress,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";

import { TimelineContent } from "@mui/lab";

import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Build as BuildIcon,
  Comment as CommentIcon,
  Send as SendIcon,
} from "@mui/icons-material";

import Layout from "../common/Layout";
import { AuthContext } from "../../context/AuthContext";
import { useSnackbar } from "notistack";

const RequestDetails = () => {
  const { id } = useParams()
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [request, setRequest] = useState(null)
  const [assignees, setAssignees] = useState([])
  const [comments, setComments] = useState([])

  const [newComment, setNewComment] = useState("")
  const [selectedAssignee, setSelectedAssignee] = useState("")
  const [status, setStatus] = useState("")

  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [closeReason, setCloseReason] = useState("")

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        const requestResponse = await fetch(`http://localhost:9090/request/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!requestResponse.ok) {
          throw new Error('Failed to fetch request details');
        }

        const requestData = await requestResponse.json();
        setRequest(requestData);

        if (requestData.assignedUser) {
          setSelectedAssignee(requestData.assignedUser.id);
        }

        setStatus(requestData.status)
        if (currentUser.role === "facility_head") {
          const assigneesResponse = await fetch('http://localhost:9090/facility-head/assignee', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (assigneesResponse.ok) {
            const assigneesData = await assigneesResponse.json();
            setAssignees(assigneesData);
          }
        }

        const commentsResponse = await fetch(`http://localhost:9090/conversations/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (commentsResponse.ok) {
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
        }

      } catch (error) {
        enqueueSnackbar('Failed to load request details', { variant: 'error' });
        navigate('/requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [id, navigate, enqueueSnackbar])

  const handleAssigneeChange = async (e) => {
    const assigneeId = e.target.value;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/assign-request/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          assignedUserId: assigneeId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign request');
      }
      if (assigneeId == "") {
        setStatus("UNASSIGNED")
      }
      else {
        setStatus("ASSIGNED")
      }
      enqueueSnackbar("Request assigned successfully", { variant: "success" })
      setSelectedAssignee(assigneeId)
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to assign request", { variant: "error" })
      setSelectedAssignee(request.assignedTo?.id || "")
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/conversations/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: newComment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add comment');
      }

      const data = await response.json();

      const newCommentObj = {
        id: Date.now().toString(),
        text: newComment,
        createdAt: new Date().toISOString(),
        user: {
          id: currentUser.id,
          name: currentUser.firstName + " " + currentUser.lastName,
        },
      }

      setComments((prev) => [...prev, newCommentObj])
      setNewComment("")

      enqueueSnackbar("Comment added successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to add comment", { variant: "error" })
    }
  }

  const handleOpenCloseDialog = () => {
    setCloseDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setCloseDialogOpen(false)
    setCloseReason("")
  }

  const handleCloseRequest = async () => {
    if (currentUser.role !== "user" && !closeReason.trim()) {
      enqueueSnackbar("Please provide a reason or description", { variant: "warning" })
      return
    }

    try {
      const token = localStorage.getItem('token');
      let response;
      let success_message;
      if (currentUser.role === "user") {
        response = await fetch(`http://localhost:9090/request/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
          }),
        });
        success_message = "Request Deleted Successfully"
      }
      else {
        let url = "";
        if (currentUser.role === "assignee") {
          if (status === "ASSIGNED") {
            url = `http://localhost:9090/mark-in-progress/${id}`;
            success_message = "Request Status Updated Successfully"
          }
          else {
            url = `http://localhost:9090/close-request/${id}`;
            success_message = "Request Closed Successfully"
          }
        }
        else {
          url = `http://localhost:9090/reject-request/${id}`;
          success_message = "Request Reject Successfully"
        }
        response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            text: closeReason
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to close request');
      }

      setRequest((prev) => ({
        ...prev,
        status: "COMPLETED",
      }))
      handleCloseDialog()
      enqueueSnackbar(success_message, { variant: "success" })
      navigate("/requests");
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to close request", { variant: "error" })
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "low":
        return "success"
      case "medium":
        return "info"
      case "high":
        return "warning"
      case "critical":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "UNASSIGNED":
        return "Unassigned"
      case "ASSIGNED":
        return "Assigned"
      case "WORK_IN_PROGRESS":
        return "In Progess"
      case "COMPLETED":
        return "Completed"
      case "REJECTED":
        return "Rejected"
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "unassigned":
        return "warning"
      case "assigned":
        return "info"
      case "in progress":
        return "primary"
      case "closed":
        return "success"
      case "rejected":
        return "error"
      default:
        return "default"
    }
  }

  if (loading) {
    return (
      <Layout title="Request Details">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  if (!request) {
    return (
      <Layout title="Request Details">
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            Request not found
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/requests")}
            sx={{ mt: 2 }}
          >
            Back to Requests
          </Button>
        </Paper>
      </Layout>
    )
  }

  return (
    <Layout title="Request Details">
      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/requests")}>
          Back to Requests
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h5" gutterBottom>
              {request.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              <Chip
                label={request.severity?.charAt(0).toUpperCase() + request.severity?.slice(1)}
                color={getSeverityColor(request.severity)}
                size="small"
                variant="outlined"
              />
              <Chip
                label={getStatusText(status)}
                color={getStatusColor(status)}
                size="small"
              />
              <Chip label={request.facility.name} size="small" variant="outlined" />
            </Box>
          </Box>

          {status === "UNASSIGNED" && currentUser.role === "user" && (
            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleOpenCloseDialog}>
              Delete Request
            </Button>
          )}
          {status === "WORK_IN_PROGRESS" && currentUser.role === "assignee" && (
            <Button variant="outlined" color="success" startIcon={<CheckCircleIcon />} onClick={handleOpenCloseDialog}>
              Mark as Completed
            </Button>
          )}
          {status === "ASSIGNED" && currentUser.role === "assignee" && (
            <Button variant="outlined" color="success" startIcon={<CheckCircleIcon />} onClick={handleOpenCloseDialog}>
              Mark as In-Progess
            </Button>
          )}
          {status === "UNASSIGNED" && currentUser.role === "facility_head" && (
            <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={handleOpenCloseDialog}>
              Reject Request
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle1" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {request.description}
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Request Details
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Request ID
                </Typography>
                <Typography variant="body1">{request.id}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Created By
                </Typography>
                <Typography variant="body1">{request.createdUser.firstName + " " + request.createdUser.lastName}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Created At
                </Typography>
                <Typography variant="body1">{new Date(request.createdAt).toLocaleString()}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Assigned To
                </Typography>
                {currentUser.role === "facility_head" && status !== "COMPLETED" && status !== "REJECTED" ? (
                  <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                    <InputLabel id="assignee-label">Assignee</InputLabel>
                    <Select
                      labelId="assignee-label"
                      id="assignee"
                      value={selectedAssignee}
                      label="Assignee"
                      onChange={handleAssigneeChange}
                    >
                      <MenuItem value="">
                        <em>Unassigned</em>
                      </MenuItem>
                      {assignees.map((assignee) => (
                        <MenuItem key={assignee.id} value={assignee.id}>
                          {assignee.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography variant="body1">{request.assignedUser ? request.assignedUser.firstName + " " + request.assignedUser.lastName : "Unassigned"}</Typography>
                )}
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Typography variant="body1">
                  {status
                    ?.toLowerCase()
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Conversations
            </Typography>

            <Box sx={{ mb: 3, maxHeight: 300, overflowY: "auto" }}>
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: "background.default", borderRadius: 1 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography variant="subtitle2">{comment.user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(comment.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                    <Typography variant="body2">{comment.text}</Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No comments yet.
                </Typography>
              )}
            </Box>

            {status !== "closed" && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  multiline
                  rows={2}
                />
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<SendIcon />}
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  sx={{ alignSelf: "flex-end" }}
                >
                  Send
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={closeDialogOpen} onClose={handleCloseDialog}>
        {currentUser.role === "facility_head" && (<DialogTitle>Reject Request</DialogTitle>)}
        {currentUser.role === "assignee" && status === "WORK_IN_PROGRESS" && (<DialogTitle>Mark as Completed</DialogTitle>)}
        {currentUser.role === "assignee" && status === "ASSIGNED" && (<DialogTitle>Mark as In-Progess</DialogTitle>)}
        {currentUser.role === "user" && (<DialogTitle>Delete Request</DialogTitle>)}

        <DialogContent>
          {currentUser.role === "facility_head" && (<DialogContentText>Please provide a reason for rejecting this request.</DialogContentText>)}
          {currentUser.role === "assignee" && status === "WORK_IN_PROGRESS" && (<DialogContentText>Please provide a details for closing this request.</DialogContentText>)}
          {currentUser.role === "assignee" && status === "ASSIGNED" && (<DialogContentText>Please provide a some estimate and description about the work.</DialogContentText>)}
          {currentUser.role === "user" && (<DialogContentText>Are you sure you want delete this request. This action could not be undo</DialogContentText>)}

          {currentUser.role === "assignee" && (<TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Description"
            fullWidth
            variant="outlined"
            value={closeReason}
            onChange={(e) => setCloseReason(e.target.value)}
            multiline
            rows={3}
          />)}
          {(currentUser.role === "facility_head" && <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Reason"
            fullWidth
            variant="outlined"
            value={closeReason}
            onChange={(e) => setCloseReason(e.target.value)}
            multiline
            rows={3}
          />)}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {currentUser.role === "facility_head" && (
            <Button onClick={handleCloseRequest} color="primary" variant="contained">
              Reject Request
            </Button>
          )}
          {currentUser.role === "assignee" && status === "WORK_IN_PROGRESS" && (
            <Button onClick={handleCloseRequest} color="primary" variant="contained">
              Mark As Completed
            </Button>
          )}
          {currentUser.role === "assignee" && status === "ASSIGNED" && (
            <Button onClick={handleCloseRequest} color="primary" variant="contained">
              Mark Request In-Progress
            </Button>
          )}
          {currentUser.role === "user" && (
            <Button onClick={handleCloseRequest} color="primary" variant="contained">
              Delete
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Layout>
  )
}

export default RequestDetails
