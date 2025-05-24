"use client"

import React, { useState, useEffect } from "react"
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material"
import { Assignment, Check, Person, Business } from "@mui/icons-material"

const RecentActivityList = () => {
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])

  useEffect(() => {
    // Fetch recent activities
    // In a real app, you would make API calls to your backend

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Dummy data
      // setActivities([
      //   {
      //     id: 1,
      //     type: "request_created",
      //     message: "New request created: Projector not working in CS-101",
      //     timestamp: "2023-06-15T10:30:00Z",
      //     user: "John Doe",
      //   },
      //   {
      //     id: 2,
      //     type: "request_assigned",
      //     message: "Request assigned to: Mike Johnson",
      //     timestamp: "2023-06-14T14:20:00Z",
      //     user: "Admin",
      //   },
      //   {
      //     id: 3,
      //     type: "request_completed",
      //     message: "Request completed: AC repair in Library",
      //     timestamp: "2023-06-13T09:15:00Z",
      //     user: "Mike Johnson",
      //   },
      //   {
      //     id: 4,
      //     type: "facility_added",
      //     message: "New facility added: Computer Lab 3",
      //     timestamp: "2023-06-12T11:45:00Z",
      //     user: "Admin",
      //   },
      //   {
      //     id: 5,
      //     type: "assignee_added",
      //     message: "New assignee added: Sarah Williams",
      //     timestamp: "2023-06-11T16:30:00Z",
      //     user: "Admin",
      //   },
      // ])

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)

    // /* 
    // // Real implementation would look like:
    // const fetchRecentActivities = async () => {
    //   try {
    //     const token = localStorage.getItem('token');
    //     const response = await fetch('/api/activities', {
    //       headers: {
    //         'Authorization': `Bearer ${token}`
    //       }
    //     });
        
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch activities');
    //     }
        
    //     const data = await response.json();
    //     setActivities(data);
    //   } catch (error) {
    //     console.error('Error fetching activities:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
    // fetchRecentActivities();
    // */
  }, [])

  const getActivityIcon = (type) => {
    switch (type) {
      case "request_created":
      case "request_assigned":
        return <Assignment />
      case "request_completed":
        return <Check />
      case "assignee_added":
        return <Person />
      case "facility_added":
        return <Business />
      default:
        return <Assignment />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case "request_created":
        return "#2196f3"
      case "request_assigned":
        return "#ff9800"
      case "request_completed":
        return "#4caf50"
      case "assignee_added":
        return "#9c27b0"
      case "facility_added":
        return "#f44336"
      default:
        return "#2196f3"
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <React.Fragment key={activity.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>{getActivityIcon(activity.type)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={activity.message}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {activity.user}
                    </Typography>
                    {` — ${new Date(activity.timestamp).toLocaleString()}`}
                  </>
                }
              />
            </ListItem>
            {index < activities.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
          No recent activities found.
        </Typography>
      )}
    </List>
  )
}

export default RecentActivityList
