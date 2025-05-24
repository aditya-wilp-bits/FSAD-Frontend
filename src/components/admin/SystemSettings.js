"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
  Divider,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import { Save as SaveIcon } from "@mui/icons-material"
import { useSnackbar } from "notistack"

const SystemSettings = () => {
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: "",
    siteDescription: "",
    adminEmail: "",
    emailNotifications: true,
    autoAssignRequests: false,
    requestClosurePolicy: "any",
    maintenanceMode: false,
    defaultSeverity: "medium",
    requestsPerPage: 10,
    sessionTimeout: 30,
  })

  useEffect(() => {
    // Fetch settings
    // In a real app, you would make API calls to your backend

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Dummy data
      setSettings({
        siteName: "Campus Help Desk",
        siteDescription: "Online Help Desk for Campus Facilities",
        adminEmail: "admin@example.com",
        emailNotifications: true,
        autoAssignRequests: false,
        requestClosurePolicy: "any",
        maintenanceMode: false,
        defaultSeverity: "medium",
        requestsPerPage: 10,
        sessionTimeout: 30,
      })

      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)

    /* 
    // Real implementation would look like:
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/admin/settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        enqueueSnackbar('Failed to load settings', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
    */
  }, [enqueueSnackbar])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSaveSettings = async () => {
    try {
      setSaving(true)

      // In a real app, you would make API calls to your backend

      /* 
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save settings');
      }
      */

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      enqueueSnackbar("Settings saved successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to save settings", { variant: "error" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        System Settings
      </Typography>

      {settings.maintenanceMode && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Maintenance mode is currently enabled. The system is only accessible to administrators.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          General Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Site Name"
              name="siteName"
              value={settings.siteName}
              onChange={handleInputChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Admin Email"
              name="adminEmail"
              type="email"
              value={settings.adminEmail}
              onChange={handleInputChange}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Site Description"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="session-timeout-label">Session Timeout (minutes)</InputLabel>
              <Select
                labelId="session-timeout-label"
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleInputChange}
                label="Session Timeout (minutes)"
              >
                <MenuItem value={15}>15 minutes</MenuItem>
                <MenuItem value={30}>30 minutes</MenuItem>
                <MenuItem value={60}>1 hour</MenuItem>
                <MenuItem value={120}>2 hours</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="requests-per-page-label">Requests Per Page</InputLabel>
              <Select
                labelId="requests-per-page-label"
                name="requestsPerPage"
                value={settings.requestsPerPage}
                onChange={handleInputChange}
                label="Requests Per Page"
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Request Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="default-severity-label">Default Severity</InputLabel>
              <Select
                labelId="default-severity-label"
                name="defaultSeverity"
                value={settings.defaultSeverity}
                onChange={handleInputChange}
                label="Default Severity"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="critical">Critical</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="request-closure-policy-label">Request Closure Policy</InputLabel>
              <Select
                labelId="request-closure-policy-label"
                name="requestClosurePolicy"
                value={settings.requestClosurePolicy}
                onChange={handleInputChange}
                label="Request Closure Policy"
              >
                <MenuItem value="any">Anyone can close</MenuItem>
                <MenuItem value="creator">Only creator can close</MenuItem>
                <MenuItem value="assignee">Only assignee can close</MenuItem>
                <MenuItem value="admin">Only admin can close</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoAssignRequests}
                    onChange={handleSwitchChange}
                    name="autoAssignRequests"
                  />
                }
                label="Auto-assign requests to facility assignees"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Notification Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleSwitchChange}
                    name="emailNotifications"
                  />
                }
                label="Enable email notifications"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          System Maintenance
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch checked={settings.maintenanceMode} onChange={handleSwitchChange} name="maintenanceMode" />
                }
                label="Enable maintenance mode"
              />
            </FormGroup>
            <Typography variant="caption" color="text.secondary">
              When maintenance mode is enabled, only administrators can access the system.
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </Box>
    </Box>
  )
}

export default SystemSettings
