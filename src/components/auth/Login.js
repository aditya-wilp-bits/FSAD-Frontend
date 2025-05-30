"use client"

import { useState, useContext } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { Avatar, Button, TextField, Link, Paper, Box, Grid, Typography, Alert } from "@mui/material"
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"
import { AuthContext } from "../../context/AuthContext"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setError("")
      setLoading(true)
      await login(email, password)
      navigate("/dashboard")
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: "url(https://source.unsplash.com/random?campus)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) => (t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900]),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Campus Help Desk Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Grid container>
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Typography variant="body2" color="text.secondary" align="center">
                {"Demo Accounts:"}
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                Admin: 2024sl93024@wilp.bits-pilani.ac.in / 12345678
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                Facility Head: azharcr8@gmail.com / 123456
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                Assignee: 2024sl93051@wilp.bits-pilani.ac.in / 123456
              </Typography>
              <Typography variant="caption" color="text.secondary" align="center" display="block">
                User: rungtaaditya3@gmail.com / 123456
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Login
