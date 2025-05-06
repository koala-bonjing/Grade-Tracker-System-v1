import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar({ toggleMode, mode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    setUserRole(storedRole);
  }, [location]);

  const hideOnRoutes = ["/login", "/signup"];
  if (hideOnRoutes.includes(location.pathname)) return null;

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogoutClick = () => {
    handleMenuClose();
    setOpenLogoutDialog(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    setUserRole(null);
    setOpenLogoutDialog(false);
    navigate("/login");
  };

  const handleCloseDialog = () => setOpenLogoutDialog(false);

  const navItems = [
    { label: "Dashboard", path: "/" },
    {
      label: userRole === "student" ? "My Grades" : "Student Grades",
      path: "/student-grades",
    },
    ...(userRole === "teacher"
      ? [{ label: "Teacher Grading", path: "/teacher-grading" }]
      : []),
    { label: "Courses", path: "/subject-grades" },
  ];

  return (
    <>
      <AppBar
        position="static"
        color="default"
        sx={{
          mb: 3,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 1,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: "inherit",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Grade Tracker
          </Typography>

          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.label}
                    component={Link}
                    to={item.path}
                    onClick={handleMenuClose}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem onClick={handleLogoutClick}>Log Out</MenuItem>
                <MenuItem onClick={toggleMode}>
                  {mode === "dark" ? "Light Mode" : "Dark Mode"}
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{ fontWeight: 500 }}
                >
                  {item.label}
                </Button>
              ))}
              <Button onClick={handleLogoutClick} color="inherit">
                Log Out
              </Button>
              <IconButton
                sx={{ ml: 1 }}
                onClick={toggleMode}
                color="inherit"
                aria-label="toggle theme"
              >
                {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Logout Dialog */}
      <Dialog open={openLogoutDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>Are you sure you want to log out?</DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{
              "&:hover": {
                backgroundColor: "lightgray",
                color: "black",
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={handleLogout}
            autoFocus
            sx={{
              "&:hover": {
                backgroundColor: "#1976d2",
                color: "white",
              },
            }}
          >
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
