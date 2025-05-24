"use client"

import React, { useState, useEffect, useContext } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from "@mui/material"
import {
  Add as AddIcon,
  ListAlt as RequestsIcon,
  Assessment as ReportsIcon,
  Business as FacilityIcon,
  People as AssigneeIcon,
} from "@mui/icons-material"
import Layout from "../common/Layout"
import { AuthContext } from "../../context/AuthContext"
import RequestStatusChart from "./RequestStatusChart"
import RecentActivityList from "./RecentActivityList"

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext)
  console.log(currentUser)
  currentUser.role = currentUser.role.toLowerCase();
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalRequests: 0,
    openRequests: 0,
    closedRequests: 0,
    unassignedRequests: 0,
    inProgressRequests: 0,
  })
  const [recentRequests, setRecentRequests] = useState([])
  const [assignedRequests, setAssignedRequests] = useState([])

  useEffect(() => {
    // Fetch dashboard data
    // In a real app, you would make API calls to your backend

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Dummy data
      setStats({
        totalRequests: 125,
        openRequests: 42,
        closedRequests: 83,
        unassignedRequests: 15,
        inProgressRequests: 27,
      })

      setRecentRequests([
        {
          id: "1",
          title: "Projector not working in CS-101",
          facility: "Computer Science Lab",
          severity: "High",
          status: "Unassigned",
          createdAt: "2023-06-15T10:30:00Z",
        },
        {
          id: "2",
          title: "AC not cooling in Library",
          facility: "Library",
          severity: "Medium",
          status: "Assigned",
          createdAt: "2023-06-14T14:20:00Z",
        },
        {
          id: "3",
          title: "Water leakage in Hostel Block B",
          facility: "Hostel",
          severity: "High",
          status: "In Progress",
          createdAt: "2023-06-13T09:15:00Z",
        },
      ])

      setAssignedRequests([
        {
          id: "4",
          title: "Replace light bulbs in ME-201",
          facility: "Mechanical Engineering",
          severity: "Low",
          status: "Assigned",
          createdAt: "2023-06-12T11:45:00Z",
        },
        {
          id: "5",
          title: "Fix broken chair in Canteen",
          facility: "Canteen",
          severity: "Low",
          status: "In Progress",
          createdAt: "2023-06-11T16:30:00Z",
        },
      ])

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)

    /* 
    // Real implementation would look like:
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setStats(data.stats);
        setRecentRequests(data.recentRequests);
        setAssignedRequests(data.assignedRequests);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    */
  }, [])

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
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
      <Layout title="Dashboard">
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  return (
    <Layout title="Dashboard">
      <Grid container spacing={3}>
        {/* Welcome Card */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Welcome, {currentUser.firstName}!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {currentUser.role === "admin" && "Administrator Dashboard"}
                {currentUser.role === "facility_head" && "Facility Head Dashboard"}
                {currentUser.role === "assignee" && "Assignee Dashboard"}
                {currentUser.role === "user" && "User Dashboard"}
              </Typography>
            </Box>
            {currentUser.role === "user" && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                component={RouterLink}
                to="/requests/new"
              >
                New Request
              </Button>
            )}

          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Requests
                  </Typography>
                  <Typography variant="h3">{stats.totalRequests}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Open Requests
                  </Typography>
                  <Typography variant="h3">{stats.openRequests}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Closed Requests
                  </Typography>
                  <Typography variant="h3">{stats.closedRequests}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Unassigned
                  </Typography>
                  <Typography variant="h3">{stats.unassignedRequests}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    In Progress
                  </Typography>
                  <Typography variant="h3">{stats.inProgressRequests}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Request Status
            </Typography>
            <Box sx={{ height: 220, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <RequestStatusChart
                data={[
                  { name: "Unassigned", value: stats.unassignedRequests },
                  { name: "Assigned", value: stats.openRequests - stats.unassignedRequests - stats.inProgressRequests },
                  { name: "In Progress", value: stats.inProgressRequests },
                  { name: "Closed", value: stats.closedRequests },
                ]}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  )
}

export default Dashboard
