"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  CircularProgress,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"
import Layout from "../common/Layout"
import { AuthContext } from "../../context/AuthContext"
import { useSnackbar } from "notistack"

const RequestList = () => {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [requests, setRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [tabValue, setTabValue] = useState(0)
  

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:9090/request', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }
        
        const data = await response.json();
        console.log(data)
        setRequests(data);
      } catch (error) {
        console.error('Error fetching requests:', error);
        enqueueSnackbar('Failed to load requests', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequests();
  }, [enqueueSnackbar]
  
)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
  }

  const handleViewRequest = (event, request) => {
    navigate(`/requests/${request.id}`)
  }

  const filteredRequests = requests.filter((request) => {
    // Filter by tab
    if (tabValue === 1 && request.status === "COMPLETED") return false
    if (tabValue === 1 && request.status === "REJECTED") return false
    if (tabValue === 2 && request.status === "UNASSIGNED" ) return false
    if (tabValue === 2 && request.status === "ASSIGNED" ) return false
    if (tabValue === 2 && request.status === "WORK_IN_PROGRESS" ) return false

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return (
        request.title.toLowerCase().includes(searchLower) ||
        request.facility.name.toLowerCase().includes(searchLower) ||
        request.status.toLowerCase().includes(searchLower) ||
        request.severity.toLowerCase().includes(searchLower)
      )
    }

    return true
  })

  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "UNASSIGNED":
        return "warning"
      case "ASSIGNED":
        return "info"
      case "WORK_IN_PROGRESS":
        return "primary"
      case "COMPLETED":
        return "success"
      case "REJECTED":
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

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "facility",
      headerName: "Facility",
      flex: 0.7,
      minWidth: 150,
      valueGetter: (params) => params.row.facility?.name || "-",
    },
    {
      field: "severity",
      headerName: "Severity",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={getSeverityColor(params.value)}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <Chip
          label={getStatusText(params.value)}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "createdAt",
      headerName: "Created",
      flex: 0.7,
      minWidth: 150,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleString()
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.3,
      minWidth: 100,
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Actions">
            <IconButton size="small" onClick={(event) => handleViewRequest(event, params.row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ]

  return (
    <Layout title="My Requests">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5">Requests</Typography>
          
          {currentUser.role === "user" && (<Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/requests/new")}>
            New Request
          </Button>)}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="All Requests" />
            <Tab label="Open" />
            <Tab label="Completed" />
          </Tabs>

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              size="small"
              placeholder="Search Requests"
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
              sx={{ mr: 1 }}
            />
          </Box>
        </Box>

        <Box sx={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={filteredRequests}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            disableSelectionOnClick
            loading={loading}
            components={{
              NoRowsOverlay: () => (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    No requests found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {searchTerm ? "Try adjusting your search" : "Create a new request to get started"}
                  </Typography>
                </Box>
              ),
              LoadingOverlay: () => (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                  <CircularProgress />
                </Box>
              ),
            }}
          />
        </Box>
      </Paper>
    </Layout>
  )
}

export default RequestList
