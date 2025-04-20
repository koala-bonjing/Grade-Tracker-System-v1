// In Login.js
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

export default function Login() {
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
        backgroundColor: "#f0f4f8", // soft light background
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
            backgroundColor: "#ffffff",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Grading Tracker System Login
          </Typography>

          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={handleRoleChange}
            sx={{ mb: 3 }}
          >
            <ToggleButton value="student">Login as Student</ToggleButton>
            <ToggleButton value="teacher">Login as Teacher</ToggleButton>
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {role === "teacher" && (
              <TextField
                fullWidth
                label="Teacher Access Code"
                margin="normal"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            )}

            <Button type="submit" variant="contained" sx={{ mt: 3 }} fullWidth>
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
