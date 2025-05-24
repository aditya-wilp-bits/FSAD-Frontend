"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import CircularProgress from "@mui/material/CircularProgress"
import Box from "@mui/material/Box"

const ProtectedRoute = ({ children, adminOnly = false, facilityHeadOnly = false, assigneeOnly = false }) => {
  const { currentUser, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (adminOnly && currentUser.role !== "admin") {
    return <Navigate to="/dashboard" />
  }

  if (facilityHeadOnly && currentUser.role !== "facility_head") {
    return <Navigate to="/dashboard" />
  }

  if (assigneeOnly && currentUser.role !== "assignee") {
    return <Navigate to="/dashboard" />
  }

  return children
}

export default ProtectedRoute
