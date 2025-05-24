"use client"

import { useState, useEffect } from "react"
import {
  Box,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
} from "@mui/icons-material"
import { useSnackbar } from "notistack"

const UserManagement = () => {
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    department: "",
  })

  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    // Fetch users
    // In a real app, you would make API calls to your backend

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Dummy data
      const dummyUsers = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
          department: "Administration",
          status: "active",
          lastLogin: "2023-06-15T10:30:00Z",
        },
        {
          id: "2",
          name: "Facility Head",
          email: "facility@example.com",
          role: "g",
          department: "Computer Science",
          status: "active",
          lastLogin: "2023-06-14T14:20:00Z",
        },
        {
          id: "3",
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          role: "assignee",
          department: "Computer Science",
          status: "active",
          lastLogin: "2023-06-13T09:15:00Z",
        },
        {
          id: "4",
          name: "John Doe",
          email: "john.doe@example.com",
          role: "user",
          department: "Electrical Engineering",
          status: "active",
          lastLogin: "2023-06-12T11:45:00Z",
        },
        {
          id: "5",
          name: "Jane Smith",
          email: "jane.smith@example.com",
          role: "user",
          department: "Mechanical Engineering",
          status: "inactive",
          lastLogin: "2023-06-01T16:30:00Z",
        },
      ]

      setUsers(dummyUsers)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)

    /* 
    // Real implementation would look like:
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        enqueueSnackbar('Failed to load users', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
    */
  }, [enqueueSnackbar])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleOpenDialog = (user = null) => {
    if (user) {
      setCurrentUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      })
    } else {
      setCurrentUser(null)
      setFormData({
        name: "",
        email: "",
        role: "user",
        department: "",
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setCurrentUser(null)
  }

  const handleOpenDeleteDialog = (user) => {
    setCurrentUser(user)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setCurrentUser(null)
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
      // Validate form
      if (!formData.name.trim() || !formData.email.trim() || !formData.role || !formData.department.trim()) {
        enqueueSnackbar("Please fill in all required fields", { variant: "warning" })
        return
      }

      // In a real app, you would make API calls to your backend

      /* 
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const url = currentUser 
        ? `/api/admin/users/${currentUser.id}` 
        : '/api/admin/users';
      const method = currentUser ? 'PUT' : 'POST';
      
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
        throw new Error(errorData.message || 'Failed to save user');
      }
      
      const data = await response.json();
      */

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (currentUser) {
        // Update existing user
        setUsers((prevUsers) => prevUsers.map((user) => (user.id === currentUser.id ? { ...user, ...formData } : user)))
        enqueueSnackbar("User updated successfully", { variant: "success" })
      } else {
        // Add new user
        const newUser = {
          id: Date.now().toString(),
          ...formData,
          status: "active",
          lastLogin: null,
        }
        setUsers((prevUsers) => [...prevUsers, newUser])
        enqueueSnackbar("User added successfully", { variant: "success" })
      }

      handleCloseDialog()
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to save user", { variant: "error" })
    }
  }

  const handleDelete = async () => {
    try {
      // In a real app, you would make API calls to your backend

      /* 
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${currentUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }
      */

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove user from state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== currentUser.id))

      enqueueSnackbar("User deleted successfully", { variant: "success" })
      handleCloseDeleteDialog()
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to delete user", { variant: "error" })
    }
  }

  const handleToggleStatus = async (user) => {
    try {
      // In a real app, you would make API calls to your backend

      /* 
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${user.id}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to toggle user status');
      }
      */

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Update user status in state
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u)),
      )

      enqueueSnackbar(`User ${user.status === "active" ? "deactivated" : "activated"} successfully`, {
        variant: "success",
      })
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to toggle user status", { variant: "error" })
    }
  }

  const handleMenuOpen = (event, user) => {
    setMenuAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
    setSelectedUser(null)
  }

  const handleEditUser = () => {
    handleMenuClose()
    handleOpenDialog(selectedUser)
  }

  const handleDeleteUser = () => {
    handleMenuClose()
    handleOpenDeleteDialog(selectedUser)
  }

  const handleToggleUserStatus = () => {
    handleMenuClose()
    handleToggleStatus(selectedUser)
  }

  const filteredUsers = users.filter((user) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.role.toLowerCase().includes(searchLower) ||
        user.department.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "error"
      case "facility_head":
        return "warning"
      case "assignee":
        return "info"
      case "user":
        return "success"
      default:
        return "default"
    }
  }

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "error"
  }

  const departments = [
    "Administration",
    "Computer Science",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Hostel Management",
    "Canteen",
    "Gymnasium",
    "Library",
    "Other",
  ]

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h6">User Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add User
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search users..."
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role.charAt(0).toUpperCase() + user.role.slice(1).replace("-", " ")}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        color={getStatusColor(user.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body1" color="text.secondary">
                      No users found
                    </Typography>
                    {searchTerm && (
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{currentUser ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentUser ? "Update the user details below." : "Enter the details of the new user."}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            name="name"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.name}
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
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              label="Role"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="facility-head">Facility Head</MenuItem>
              <MenuItem value="assignee">Assignee</MenuItem>
              <MenuItem value="user">User</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense" required>
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              label="Department"
            >
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {currentUser ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{currentUser?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* User Actions Menu */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEditUser}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleToggleUserStatus}>
          <ListItemIcon>
            {selectedUser?.status === "active" ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
          </ListItemIcon>
          <ListItemText>{selectedUser?.status === "active" ? "Deactivate" : "Activate"}</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteUser}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default UserManagement
