"use client"

import React, { useState, useEffect, useContext } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  CircularProgress,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Person as PersonIcon,
  Password,
} from "@mui/icons-material"
import Layout from "../common/Layout"
import { AuthContext } from "../../context/AuthContext"
import { useSnackbar } from "notistack"

const AssigneeList = () => {
  const { currentUser } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [assignees, setAssignees] = useState([])
  const [facilities, setFacilities] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentAssignee, setCurrentAssignee] = useState(null)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    facilityId: "",
    password : ""
  })

  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedAssignee, setSelectedAssignee] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        const assigneesResponse = await fetch('http://localhost:9090/admin/facility-head', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!assigneesResponse.ok) {
          throw new Error('Failed to fetch assignees');
        }
        
        const assigneesData = await assigneesResponse.json();
        console.log(assigneesData);
        setAssignees(assigneesData);
        
        const facilitiesResponse = await fetch('http://localhost:9090/facility', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (facilitiesResponse.ok) {
          const facilitiesData = await facilitiesResponse.json();
          setFacilities(facilitiesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        enqueueSnackbar('Failed to load data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [enqueueSnackbar])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleOpenDialog = (assignee = null) => {
    if (assignee) {
      setCurrentAssignee(assignee)
      setFormData({
        firstName: assignee.firstName,
        lastName: assignee.lastName,
        email: assignee.email,
        facilityId: assignee.facilityId,
        password : "",
      })
    } else {
      setCurrentAssignee(null)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        facilityId: "",
        password: "",
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setCurrentAssignee(null)
  }

  const handleOpenDeleteDialog = (assignee) => {
    setCurrentAssignee(assignee)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setCurrentAssignee(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    try {
      console.log(formData)
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.password.trim() || !formData.facilityId) {
        enqueueSnackbar("Please fill in all required fields", { variant: "warning" })
        return
      }

      
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const url = currentAssignee 
        ? `http://localhost:9090/admin/facility-head/${currentAssignee.id}` 
        : 'http://localhost:9090/admin/register-facility-head';
      const method = currentAssignee ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save assignee');
      }
      
      const data = await response.json();
      
      await new Promise((resolve) => setTimeout(resolve, 500))

      const facility = facilities.find((f) => f.id === formData.facilityId)

      formData.name = formData.firstName + " " + formData.lastName;

      if (currentAssignee) {
        setAssignees((prevAssignees) =>
          prevAssignees.map((assignee) =>
            assignee.id === currentAssignee.id
              ? {
                  ...assignee,
                  ...formData,
                  facility: facility?.name || "Unknown",
                }
              : assignee,
          ),
        )
        enqueueSnackbar("Assignee updated successfully", { variant: "success" })
      } else {
        const newAssignee = {
          id: Date.now().toString(),
          ...formData,
          facility: facility?.name || "Unknown",
          activeRequests: 0,
        }
        setAssignees((prevAssignees) => [...prevAssignees, newAssignee])
        enqueueSnackbar("Assignee added successfully", { variant: "success" })
      }

      handleCloseDialog()
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to save assignee", { variant: "error" })
    }
  }

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/admin/facility-head/${currentAssignee.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete assignee');
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      setAssignees((prevAssignees) => prevAssignees.filter((assignee) => assignee.id !== currentAssignee.id))

      enqueueSnackbar("Assignee deleted successfully", { variant: "success" })
      handleCloseDeleteDialog()
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to delete assignee", { variant: "error" })
    }
  }

  const handleMenuOpen = (event, assignee) => {
    setMenuAnchorEl(event.currentTarget)
    setSelectedAssignee(assignee)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setSelectedAssignee(null)
  }

  const handleEditAssignee = () => {
    handleMenuClose()
    handleOpenDialog(selectedAssignee)
  }

  const handleDeleteAssignee = () => {
    handleMenuClose()
    handleOpenDeleteDialog(selectedAssignee)
  }

  const filteredAssignees = assignees.filter((assignee) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        assignee.name.toLowerCase().includes(searchLower) ||
        assignee.email.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <Layout title="Facility Head">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5">Facility Head</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Facility Head
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search assignees..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleClearSearch}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {filteredAssignees.length > 0 ? (
              filteredAssignees.map((assignee) => (
                <React.Fragment key={assignee.id}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={assignee.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {assignee.email}
                          </Typography>
                          {` — ${assignee.facility}`}
                        </>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <IconButton edge="end" onClick={(e) => handleMenuOpen(e, assignee)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="body1" color="text.secondary">
                  No assignees found
                </Typography>
                {searchTerm && (
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search
                  </Typography>
                )}
              </Box>
            )}
          </List>
        )}
      </Paper>

      {/* Add/Edit Assignee Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{currentAssignee ? "Edit Faciliy Head" : "Add Facility Head"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentAssignee ? "Update the facility head details below." : "Enter the facility head details."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            id="email"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            id="password"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="facility-label">Facility</InputLabel>
            <Select
              labelId="facility-label"
              id="facilityId"
              name="facilityId"
              value={formData.facilityId}
              onChange={handleInputChange}
              label="Facility"
            >
              {facilities.map((facility) => (
                <MenuItem key={facility.id} value={facility.id}>
                  {facility.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentAssignee ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the facility head "{currentAssignee?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assignee Actions Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditAssignee}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteAssignee}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Layout>
  )
}

export default AssigneeList
