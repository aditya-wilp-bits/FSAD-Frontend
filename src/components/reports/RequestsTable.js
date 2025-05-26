"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Chip,
} from "@mui/material"

const RequestsTable = ({ requests }) => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

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

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Facility</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Assigned To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No requests found.
                </TableCell>
              </TableRow>
            ) : (
              requests
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((request) => (
                  <TableRow hover key={request.id}>
                    <TableCell>{request.id}</TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.facility}</TableCell>
                    <TableCell>
                      <Chip
                        label={request.severity}
                        color={getSeverityColor(request.severity)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusText(request.status)}
                        color={getStatusColor(request.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{request.createdBy}</TableCell>
                    <TableCell>{new Date(request.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{request.assignedTo || "Unassigned"}</TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={requests.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default RequestsTable
