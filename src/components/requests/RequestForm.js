"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  CircularProgress,
} from "@mui/material"
import { Send as SendIcon } from "@mui/icons-material"
import Layout from "../common/Layout"
import { AuthContext } from "../../context/AuthContext"
import { useSnackbar } from "notistack"

const RequestForm = () => {
  const { currentUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    facilityId: "",
    severity: "",
  })

  const [facilities, setFacilities] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

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
      } finally {
        setLoading(false);
      }
    };
    
    fetchFacilities();
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.facilityId) {
      newErrors.facilityId = "Facility is required"
    }

    if (!formData.severity) {
      newErrors.severity = "Severity is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      return;
    }
  
    setSubmitting(true);
  
    try {
      const token = localStorage.getItem('token');

      const payload = {
        ...formData,
        facilityId: formData.facilityId,
        severity: formData.severity.toUpperCase()
      };
  
      const response = await fetch('http://localhost:9090/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create request');
      }
  
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      enqueueSnackbar("Request created successfully", { variant: "success" });
      navigate("/requests");
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to create request", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };
  

  const severityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ]

  return (
    <Layout title="Create New Request">
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New Request
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                label="Request Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.facilityId} disabled={loading || submitting}>
                <InputLabel id="facility-label">Facility</InputLabel>
                <Select
                  labelId="facility-label"
                  id="facilityId"
                  name="facilityId"
                  value={formData.facilityId}
                  onChange={handleChange}
                  label="Facility"
                >
                  {loading ? (
                    <MenuItem disabled>Loading facilities...</MenuItem>
                  ) : (
                    facilities.map((facility) => (
                      <MenuItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {errors.facilityId && <FormHelperText>{errors.facilityId}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.severity} disabled={submitting}>
                <InputLabel id="severity-label">Severity</InputLabel>
                <Select
                  labelId="severity-label"
                  id="severity"
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  label="Severity"
                >
                  {severityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.severity && <FormHelperText>{errors.severity}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                disabled={submitting}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button variant="outlined" onClick={() => navigate("/dashboard")} disabled={submitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  endIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Layout>
  )
}

export default RequestForm
