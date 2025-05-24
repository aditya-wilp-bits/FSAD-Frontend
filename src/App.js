import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { SnackbarProvider } from "notistack"

// Components
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Dashboard from "./components/dashboard/Dashboard"
import RequestForm from "./components/requests/RequestForm"
import RequestList from "./components/requests/RequestList"
import RequestDetails from "./components/requests/RequestDetails"
import FacilityList from "./components/facilities/FacilityList"
import AssigneeList from "./components/assignees/AssigneeList"
import AdminPanel from "./components/admin/AdminPanel"
import Reports from "./components/reports/Reports"
import Help from "./components/help/Help"
import ChangePassword from "./components/auth/ChangePassword"
import NotFound from "./components/common/NotFound"
import ProtectedRoute from "./components/common/ProtectedRoute"

// Context
import { AuthProvider } from "./context/AuthContext"
import FacilityHead from "./components/facilities/FacilityHead"

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests/new"
                element={
                  <ProtectedRoute>
                    <RequestForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <RequestList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requests/:id"
                element={
                  <ProtectedRoute>
                    <RequestDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facilities"
                element={
                  <ProtectedRoute>
                    <FacilityList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/facility-head"
                element={
                  <ProtectedRoute>
                    <FacilityHead />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/assignees"
                element={
                  <ProtectedRoute>
                    <AssigneeList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/help"
                element={
                  <ProtectedRoute>
                    <Help />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
