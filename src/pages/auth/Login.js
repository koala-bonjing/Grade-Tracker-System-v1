import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
} from "@mui/material";

export default function Login({ mode }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleRoleChange = (_, newRole) => {
    if (newRole !== null) setRole(newRole);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (role === "teacher" && code.trim() === "") {
      alert("Please enter the teacher access code.");
      return;
    }

    localStorage.setItem("userRole", role);
    navigate(role === "teacher" ? "/teacher-grading" : "/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: mode === "light" ? "#f0f4f8" : "#121212", // Adjust background for both modes
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            borderRadius: 4,
            border: "1px solid #d1d5db",
            backgroundColor: mode === "light" ? "#ffffff" : "#333465", // Paper background for dark/light modes
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: mode === "light" ? "#333465" : "#e0e0e0" }}
          >
            Grading Tracker System Login
          </Typography>

          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            sx={{ mb: 3 }}
          >
            {["student", "teacher"].map((type) => (
              <ToggleButton
                key={type}
                value={type}
                sx={{
                  color: mode === "light" ? "#333465" : "#e0e0e0",
                  borderColor: "#b0bec5",
                  "&:hover": {
                    backgroundColor: mode === "light" ? "#e3f2fd" : "#555a89",
                  },
                  "&.Mui-selected": {
                    backgroundColor: mode === "light" ? "#1976d2" : "#7986cb",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: mode === "light" ? "#1565c0" : "#5c6bc0",
                    },
                  },
                }}
              >
                {`Login as ${type.charAt(0).toUpperCase() + type.slice(1)}`}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                input: { color: mode === "light" ? "#333465" : "#e0e0e0" },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                input: { color: mode === "light" ? "#333465" : "#e0e0e0" },
              }}
            />
            {role === "teacher" && (
              <TextField
                fullWidth
                label="Teacher Access Code"
                margin="normal"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                sx={{
                  input: { color: mode === "light" ? "#333465" : "#e0e0e0" },
                }}
              />
            )}

            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 3 }}
              fullWidth
              color={mode === "light" ? "primary" : "secondary"} // Button color based on mode
            >
              Login
            </Button>

            <Button sx={{ mt: 2 }} onClick={() => navigate("/signup")}>
              Don't have an account? Sign Up
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
