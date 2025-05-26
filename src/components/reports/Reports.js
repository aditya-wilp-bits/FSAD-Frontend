"use client"

import { useState, useEffect, useContext } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import Layout from "../common/Layout"
import { AuthContext } from "../../context/AuthContext"
import { useSnackbar } from "notistack"
import RequestsTable from "./RequestsTable"

const Reports = () => {
  const { currentUser } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()

  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  })
  const [facility, setFacility] = useState("all")
  const [facilities, setFacilities] = useState([])
  const [reportData, setReportData] = useState(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await fetch("http://localhost:9090/facility", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch facilities")

        const data = await response.json()
        setFacilities(data)
      } catch (error) {
        console.error("Error fetching facilities:", error)
        enqueueSnackbar("Failed to load facilities", { variant: "error" })
      } finally {
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [enqueueSnackbar])

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

      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:9090/request/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: dateRange.startDate.toISOString(),
          endDate: dateRange.endDate.toISOString(),
          facilityId: facility === "all" ? null : facility,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to generate report")
      }

      const data = await response.json()
      setReportData(data)

      enqueueSnackbar("Report generated successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar(error.message || "Failed to generate report", { variant: "error" })
    } finally {
      setGenerating(false)
    }
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
        <br />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box>
            <Grid container spacing={3}>
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

              <Grid item xs={8} md={2}>
                <DatePicker
                  label="Start Date"
                  value={dateRange.startDate}
                  onChange={handleStartDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={8} md={2}>
                <DatePicker
                  label="End Date"
                  value={dateRange.endDate}
                  onChange={handleEndDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <Box sx={{ display: "flex", justifyContent: "flex-end", height: "100%" }}>
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

            <br />

            <Box>
              <RequestsTable requests={reportData ? reportData : []} />
            </Box>
          </Box>
        </LocalizationProvider>
      </Paper>
    </Layout>
  )
}

export default Reports
