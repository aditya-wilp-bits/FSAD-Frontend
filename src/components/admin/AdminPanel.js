"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material"
import {
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material"
import Layout from "../common/Layout"
import UserManagement from "./UserManagement"
import SystemSettings from "./SystemSettings"
import { useSnackbar } from "notistack"

const AdminPanel = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [backupLoading, setBackupLoading] = useState(false)
  const [restoreLoading, setRestoreLoading] = useState(false)
  const [emailTestLoading, setEmailTestLoading] = useState(false)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleBackupData = async () => {
    try {
      setBackupLoading(true)

      // In a real app, you would make API calls to your backend

      /* 
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Backup failed');
      }
      
      const data = await response.json();
      */

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      enqueueSnackbar("System backup completed successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar(error.message || "Backup failed", { variant: "error" })
    } finally {
      setBackupLoading(false)
    }
  }

  const handleRestoreData = async () => {
    try {
      setRestoreLoading(true)

      // In a real app, you would make API calls to your backend

      /* 
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/restore', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Restore failed');
      }
      
      const data = await response.json();
      */

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      enqueueSnackbar("System restore completed successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar(error.message || "Restore failed", { variant: "error" })
    } finally {
      setRestoreLoading(false)
    }
  }

  const handleTestEmail = async () => {
    try {
      setEmailTestLoading(true)

      // In a real app, you would make API calls to your backend

      /* 
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email test failed');
      }
      
      const data = await response.json();
      */

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      enqueueSnackbar("Test email sent successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar(error.message || "Email test failed", { variant: "error" })
    } finally {
      setEmailTestLoading(false)
    }
  }

  return (
    <Layout title="Admin Panel">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Admin Panel
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Dashboard" />
            <Tab label="User Management" />
            <Tab label="System Settings" />
          </Tabs>
        </Box>

        {/* Dashboard Tab */}
        {tabValue === 0 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Backup & Restore
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Backup and restore system data. Regular backups are recommended to prevent data loss.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={backupLoading ? <CircularProgress size={20} /> : <BackupIcon />}
                        onClick={handleBackupData}
                        disabled={backupLoading}
                      >
                        {backupLoading ? "Backing up..." : "Backup Data"}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={restoreLoading ? <CircularProgress size={20} /> : <RestoreIcon />}
                        onClick={handleRestoreData}
                        disabled={restoreLoading}
                      >
                        {restoreLoading ? "Restoring..." : "Restore Data"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Email Configuration
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Configure email settings for notifications and alerts. Test the email configuration to ensure
                      proper delivery.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Button
                      variant="contained"
                      startIcon={emailTestLoading ? <CircularProgress size={20} /> : <EmailIcon />}
                      onClick={handleTestEmail}
                      disabled={emailTestLoading}
                    >
                      {emailTestLoading ? "Sending..." : "Test Email Configuration"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Statistics
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Users
                      </Typography>
                      <Typography variant="h4">125</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Total Requests
                      </Typography>
                      <Typography variant="h4">543</Typography>
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Active Requests
                      </Typography>
                      <Typography variant="h4">42</Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View Detailed Stats</Button>
                  </CardActions>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Notification Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Configure system-wide notification settings for email alerts and in-app notifications.
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Button variant="contained" startIcon={<NotificationsIcon />}>
                      Configure Notifications
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      System Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          System Version
                        </Typography>
                        <Typography variant="body1">1.0.0</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Last Backup
                        </Typography>
                        <Typography variant="body1">2023-06-15 10:30:00</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Database Size
                        </Typography>
                        <Typography variant="body1">256 MB</Typography>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Typography variant="body2" color="text.secondary">
                          Server Status
                        </Typography>
                        <Typography variant="body1" sx={{ color: "success.main" }}>
                          Online
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* User Management Tab */}
        {tabValue === 1 && <UserManagement />}

        {/* System Settings Tab */}
        {tabValue === 2 && <SystemSettings />}
      </Paper>
    </Layout>
  )
}

export default AdminPanel
