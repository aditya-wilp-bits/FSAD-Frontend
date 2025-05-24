"use client"

import { useState, useEffect, useContext } from "react"
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { Download as DownloadIcon, Email as EmailIcon, Print as PrintIcon } from "@mui/icons-material"
import Layout from "../common/Layout"
import { AuthContext } from "../../context/AuthContext"
import { useSnackbar } from "notistack"
import RequestStatusChart from "../dashboard/RequestStatusChart"
import RequestsByFacilityChart from "./RequestsByFacilityChart"
import RequestTrendChart from "./RequestTrendChart"
import RequestSeverityChart from "./RequestSeverityChart"
import RequestsTable from "./RequestsTable"

const Reports = () => {
  const { currentUser } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [reportType, setReportType] = useState("summary")
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  })
  const [facility, setFacility] = useState("all")
  const [facilities, setFacilities] = useState([])
  const [reportData, setReportData] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    // Fetch facilities
    // In a real app, you would make API calls to your backend

    // Simulate API call with setTimeout
    const timer = setTimeout(() => {
      // Dummy data
      const dummyFacilities = [
        { id: "1", name: "Computer Science Lab" },
        { id: "2", name: "Electrical Engineering Lab" },
        { id: "3", name: "Mechanical Workshop" },
        { id: "4", name: "Library" },
        { id: "5", name: "Hostel Block A" },
        { id: "6", name: "Hostel Block B" },
        { id: "7", name: "Canteen" },
        { id: "8", name: "Gymnasium" },
        { id: "9", name: "Faculty Club" },
        { id: "10", name: "Administrative Block" },
      ]

      setFacilities(dummyFacilities)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)

    /* 
    // Real implementation would look like:
    const fetchFacilities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/facilities', {
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
    */
  }, [enqueueSnackbar])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleReportTypeChange = (event) => {
    setReportType(event.target.value)
  }

  const handleFacilityChange = (event) => {
    setFacility(event.target.value)
  }

  const handleStartDateChange = (date) => {
    setDateRange((prev) => ({
      ...prev,
      startDate: date,
    }))
  }

  const handleEndDateChange = (date) => {
    setDateRange((prev) => ({
      ...prev,
      endDate: date,
    }))
  }

  const handleGenerateReport = async () => {
    try {
      setGenerating(true)

      // In a real app, you would make API calls to your backend

      /* 
      // Real implementation would look like:
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reportType,
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          facilityId: facility === 'all' ? null : facility,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate report');
      }
      
      const data = await response.json();
      setReportData(data);
      */

      // Simulate API call with setTimeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Dummy report data
      const dummyReportData = {
        summary: {
          totalRequests: 125,
          openRequests: 42,
          closedRequests: 83,
          unassignedRequests: 15,
          inProgressRequests: 27,
          averageResolutionTime: "2.5 days",
          requestsByStatus: [
            { name: "Unassigned", value: 15 },
            { name: "Assigned", value: 10 },
            { name: "In Progress", value: 17 },
            { name: "Closed", value: 83 },
          ],
          requestsByFacility: [
            { name: "Computer Science Lab", value: 25 },
            { name: "Electrical Engineering Lab", value: 18 },
            { name: "Mechanical Workshop", value: 12 },
            { name: "Library", value: 20 },
            { name: "Hostel Block A", value: 15 },
            { name: "Hostel Block B", value: 10 },
            { name: "Canteen", value: 8 },
            { name: "Gymnasium", value: 5 },
            { name: "Faculty Club", value: 2 },
            { name: "Administrative Block", value: 10 },
          ],
          requestsBySeverity: [
            { name: "Low", value: 45 },
            { name: "Medium", value: 50 },
            { name: "High", value: 25 },
            { name: "Critical", value: 5 },
          ],
          requestTrend: [
            { name: "Jan", created: 12, closed: 10 },
            { name: "Feb", created: 15, closed: 13 },
            { name: "Mar", created: 18, closed: 15 },
            { name: "Apr", created: 20, closed: 18 },
            { name: "May", created: 22, closed: 20 },
            { name: "Jun", created: 25, closed: 22 },
          ],
        },
        detailed: {
          requests: [
            {
              id: "1",
              title: "Projector not working in CS-101",
              facility: "Computer Science Lab",
              severity: "high",
              status: "closed",
              createdAt: "2023-06-01T10:30:00Z",
              closedAt: "2023-06-03T14:20:00Z",
              createdBy: "John Doe",
              assignedTo: "Mike Johnson",
              resolutionTime: "2 days, 3 hours, 50 minutes",
            },
            {
              id: "2",
              title: "AC not cooling in Library",
              facility: "Library",
              severity: "medium",
              status: "in progress",
              createdAt: "2023-06-05T14:20:00Z",
              createdBy: "Jane Smith",
              assignedTo: "David Brown",
            },
            {
              id: "3",
              title: "Water leakage in Hostel Block B",
              facility: "Hostel Block B",
              severity: "high",
              status: "assigned",
              createdAt: "2023-06-08T09:15:00Z",
              createdBy: "Robert Wilson",
              assignedTo: "Emily Davis",
            },
            {
              id: "4",
              title: "Replace light bulbs in ME-201",
              facility: "Mechanical Workshop",
              severity: "low",
              status: "closed",
              createdAt: "2023-06-10T11:45:00Z",
              closedAt: "2023-06-11T15:30:00Z",
              createdBy: "Alice Johnson",
              assignedTo: "Mike Johnson",
              resolutionTime: "1 day, 3 hours, 45 minutes",
            },
            {
              id: "5",
              title: "Fix broken chair in Canteen",
              facility: "Canteen",
              severity: "low",
              status: "closed",
              createdAt: "2023-06-12T16:30:00Z",
              closedAt: "2023-06-13T10:15:00Z",
              createdBy: "Bob Smith",
              assignedTo: "Sarah Williams",
              resolutionTime: "17 hours, 45 minutes",
            },
          ],
        },
      }

      setReportData(dummyReportData)
      enqueueSnackbar("Report generated successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to generate report", { variant: "error" })
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadReport = () => {
    enqueueSnackbar("Report download started", { variant: "info" })
    // In a real app, you would implement the download functionality
  }

  const handleEmailReport = () => {
    enqueueSnackbar("Report sent to your email", { variant: "success" })
    // In a real app, you would implement the email functionality
  }

  const handlePrintReport = () => {
    window.print()
  }

  if (loading) {
    return (
      <Layout title="Reports">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress />
        </Box>
      </Layout>
    )
  }

  return (
    <Layout title="Reports">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Reports
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Generate Report" />
            <Tab label="Scheduled Reports" disabled />
          </Tabs>
        </Box>

        {/* Generate Report Tab */}
        {tabValue === 0 && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="report-type-label">Report Type</InputLabel>
                  <Select
                    labelId="report-type-label"
                    id="report-type"
                    value={reportType}
                    label="Report Type"
                    onChange={handleReportTypeChange}
                  >
                    <MenuItem value="summary">Summary Report</MenuItem>
                    <MenuItem value="detailed">Detailed Report</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="facility-label">Facility</InputLabel>
                  <Select
                    labelId="facility-label"
                    id="facility"
                    value={facility}
                    label="Facility"
                    onChange={handleFacilityChange}
                  >
                    <MenuItem value="all">All Facilities</MenuItem>
                    {facilities.map((facility) => (
                      <MenuItem key={facility.id} value={facility.id}>
                        {facility.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange.startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={dateRange.endDate}
                    onChange={handleEndDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    variant="contained"
                    onClick={handleGenerateReport}
                    disabled={generating}
                    startIcon={generating ? <CircularProgress size={20} /> : null}
                  >
                    {generating ? "Generating..." : "Generate Report"}
                  </Button>
                </Box>
              </Grid>
            </Grid>

            {reportData && (
              <Box sx={{ mt: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">Report Results</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleDownloadReport}>
                      Download
                    </Button>
                    <Button variant="outlined" startIcon={<EmailIcon />} onClick={handleEmailReport}>
                      Email
                    </Button>
                    <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrintReport}>
                      Print
                    </Button>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {reportType === "summary" ? (
                  <Box>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={3}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Total Requests
                          </Typography>
                          <Typography variant="h4">{reportData.summary.totalRequests}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Open Requests
                          </Typography>
                          <Typography variant="h4">{reportData.summary.openRequests}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Closed Requests
                          </Typography>
                          <Typography variant="h4">{reportData.summary.closedRequests}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Paper elevation={2} sx={{ p: 2 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Avg. Resolution Time
                          </Typography>
                          <Typography variant="h4">{reportData.summary.averageResolutionTime}</Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, height: 300 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Requests by Status
                          </Typography>
                          <Box sx={{ height: 250 }}>
                            <RequestStatusChart data={reportData.summary.requestsByStatus} />
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Paper elevation={2} sx={{ p: 2, height: 300 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Requests by Severity
                          </Typography>
                          <Box sx={{ height: 250 }}>
                            <RequestSeverityChart data={reportData.summary.requestsBySeverity} />
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 2, height: 400 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Requests by Facility
                          </Typography>
                          <Box sx={{ height: 350 }}>
                            <RequestsByFacilityChart data={reportData.summary.requestsByFacility} />
                          </Box>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Paper elevation={2} sx={{ p: 2, height: 400 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Request Trend
                          </Typography>
                          <Box sx={{ height: 350 }}>
                            <RequestTrendChart data={reportData.summary.requestTrend} />
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Box>
                    <RequestsTable requests={reportData.detailed.requests} />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )}
      </Paper>
    </Layout>
  )
}

export default Reports
