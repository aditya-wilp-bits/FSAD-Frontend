"use client"

import { useState, useContext } from "react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { styled } from "@mui/material/styles"
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ListAlt as RequestsIcon,
  Add as AddIcon,
  Business as FacilityIcon,
  People as AssigneeIcon,
  AdminPanelSettings as AdminIcon,
  Assessment as ReportsIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  VpnKey as PasswordIcon,
} from "@mui/icons-material"
import { AuthContext } from "../../context/AuthContext"
import { useSnackbar } from "notistack";

const drawerWidth = 240

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}))

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}))

const Layout = ({ children, title }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(true)
  const [anchorEl, setAnchorEl] = useState(null)
  const { currentUser, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleDrawerToggle = () => {
    setOpen(!open)
  }

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async (e) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:9090/logout`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Something went wrong, logout was un-successful');
      }
      logout()
      navigate("/login")
      enqueueSnackbar("User Logout Successfully", { variant: "success" })
    } catch (error) {
      enqueueSnackbar('Something went wrong, logout was un-successful', { variant: 'error' });
    }
  }

  const handleChangePassword = () => {
    handleClose()
    navigate("/change-password")
  }

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      link: "/dashboard",
      roles: ["admin", "facility_head", "assignee", "user"],
    },
    {
      text: "All Requests",
      icon: <RequestsIcon />,
      link: "/requests",
      roles: ["admin", "facility_head"],
    },
    {
      text: "My Requests",
      icon: <RequestsIcon />,
      link: "/requests",
      roles: ["user", "assignee"],
    },
    {
      text: "New Request",
      icon: <AddIcon />,
      link: "/requests/new",
      roles: ["user"],
    },
    {
      text: "Facilities",
      icon: <FacilityIcon />,
      link: "/facilities",
      roles: ["admin"],
    },
    {
      text: "Facility Heads",
      icon: <FacilityIcon />,
      link: "/facility-head",
      roles: ["admin"],
    },
    {
      text: "Assignees",
      icon: <AssigneeIcon />,
      link: "/assignees",
      roles: ["facility_head"],
    },
    {
      text: "Reports",
      icon: <ReportsIcon />,
      link: "/reports",
      roles: ["admin"],
    }, 
    {
      text: "Help",
      icon: <HelpIcon />,
      link: "/help",
      roles: ["admin", "facility_head", "assignee", "user"],
    },
  ]

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title || "Campus Help Desk"}
          </Typography>
          {currentUser && (
            <div>
              <Tooltip title="Account settings">
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                    {currentUser.firstName ? currentUser.firstName.charAt(0) : "U"}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem disabled>
                  <Typography variant="body2">
                    Signed in as <strong>{currentUser.firstName}</strong>
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleChangePassword}>
                  <ListItemIcon>
                    <PasswordIcon fontSize="small" />
                  </ListItemIcon>
                  Change Password
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader />
        <Divider />
        <List>
          {menuItems
            .filter((item) => item.roles.includes(currentUser?.role))
            .map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={RouterLink} to={item.link}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        {children}
      </Main>
    </Box>
  )
}

export default Layout
