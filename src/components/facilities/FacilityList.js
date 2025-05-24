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
  Divider,
  CircularProgress,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material"
import Layout from "../common/Layout"
import { AuthContext } from "../../context/AuthContext"
import { useSnackbar } from "notistack"

const FacilityList = () => {
  const { currentUser } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [facilities, setFacilities] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentFacility, setCurrentFacility] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  })

  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedFacility, setSelectedFacility] = useState(null)

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:9090/facility', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch facilities');
        }
        
        const data = await response.json();
        setFacilities(data);
      } catch (error) {
        console.error('Error fetching facilities:', error);
        enqueueSnackbar('Failed to load facilities', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFacilities();
  }, [enqueueSnackbar])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleOpenDialog = (facility = null) => {
    if (facility) {
      setCurrentFacility(facility)
      setFormData({
        name: facility.name,
        location: facility.location,
        description: facility.description,
      })
    } else {
      setCurrentFacility(null)
      setFormData({
        name: "",
        location: "",
        description: "",
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setCurrentFacility(null)
  }

  const handleOpenDeleteDialog = (facility) => {
    setCurrentFacility(facility)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setCurrentFacility(null)
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
      if (!formData.name.trim()) {
        enqueueSnackbar("Facility name is required", { variant: "warning" })
        return
      }

      const token = localStorage.getItem('token');
      const url = currentFacility 
        ? `http://localhost:9090/admin/facility/${currentFacility.id}` 
        : 'http://localhost:9090/admin/facility';
      const method = currentFacility ? 'PUT' : 'POST';
      
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
        throw new Error(errorData.message || 'Failed to save facility');
      }
      
      const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 500))

      if (currentFacility) {
        setFacilities((prevFacilities) =>
          prevFacilities.map((facility) =>
            facility.id === currentFacility.id ? { ...facility, ...formData } : facility,
          ),
        )
        enqueueSnackbar("Facility updated successfully", { variant: "success" })
      } else {
        const newFacility = {
          id: Date.now().toString(),
          ...formData,
          requestCount: 0,
        }
        setFacilities((prevFacilities) => [...prevFacilities, newFacility])
        enqueueSnackbar("Facility added successfully", { variant: "success" })
      }

      handleCloseDialog()
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to save facility", { variant: "error" })
    }
  }

  const handleDelete = async () => {
    try {

      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/admin/facility/${currentFacility.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete facility');
      }

      await new Promise((resolve) => setTimeout(resolve, 500))

      setFacilities((prevFacilities) => prevFacilities.filter((facility) => facility.id !== currentFacility.id))

      enqueueSnackbar("Facility deleted successfully", { variant: "success" })
      handleCloseDeleteDialog()
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to delete facility", { variant: "error" })
    }
  }

  const handleMenuOpen = (event, facility) => {
    setMenuAnchorEl(event.currentTarget)
    setSelectedFacility(facility)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setSelectedFacility(null)
  }

  const handleEditFacility = () => {
    handleMenuClose()
    handleOpenDialog(selectedFacility)
  }

  const handleDeleteFacility = () => {
    handleMenuClose()
    handleOpenDeleteDialog(selectedFacility)
  }

  const filteredFacilities = facilities.filter((facility) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        facility.name.toLowerCase().includes(searchLower) ||
        facility.location.toLowerCase().includes(searchLower) ||
        facility.description.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  return (
    <Layout title="Facilities">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5">Facilities</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
            Add Facility
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search facilities..."
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
            {filteredFacilities.length > 0 ? (
              filteredFacilities.map((facility) => (
                <React.Fragment key={facility.id}>
                  <ListItem>
                    <ListItemText
                      primary={facility.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {facility.location}
                          </Typography>
                          {` — ${facility.description}`}
                        </>
                      }
                    />
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={`${facility.requestCount} Requests`}
                        size="small"
                        color={facility.requestCount > 0 ? "primary" : "default"}
                        variant="outlined"
                      />
                      <IconButton edge="end" onClick={(e) => handleMenuOpen(e, facility)}>
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
                  No facilities found
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

      {/* Add/Edit Facility Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{currentFacility ? "Edit Facility" : "Add New Facility"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentFacility ? "Update the facility details below." : "Enter the details of the new facility."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Facility Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            id="location"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentFacility ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the {currentFacility?.name} facility? This action cannot be undone and all facility members and request associated with it would be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Facility Actions Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditFacility}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteFacility}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Layout>
  )
}

export default FacilityList
