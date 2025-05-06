import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Alert,
  IconButton,
  Tooltip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function Signup({ mode }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });
  const [isSubmitted, setIsSubmitted] = useState(false); // Track form submission
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true); // Set submission flag to true when form is submitted
    // In a real app, you'd send this to a backend
    localStorage.setItem("userRole", formData.role);
    navigate("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: mode === "light" ? "#f0f4f8" : "#121212", // Light/dark background
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
            "&:hover": {
              boxShadow:
                mode === "light"
                  ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                  : "0px 4px 10px rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{ color: mode === "light" ? "#333465" : "#e0e0e0" }} // Text color
          >
            Create Account
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              sx={{
                input: {
                  color: mode === "light" ? "#333465" : "#e0e0e0", // Text input color
                },
                "& .MuiInputLabel-root": {
                  color: mode === "light" ? "#333465" : "#e0e0e0", // Label color
                },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: mode === "light" ? "#333465" : "#b6b7ff", // Border color on hover
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              sx={{
                input: {
                  color: mode === "light" ? "#333465" : "#e0e0e0", // Text input color
                },
                "& .MuiInputLabel-root": {
                  color: mode === "light" ? "#333465" : "#e0e0e0", // Label color
                },
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: mode === "light" ? "#333465" : "#b6b7ff", // Border color on hover
                  },
                },
              }}
            />
            <RadioGroup
              row
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              sx={{
                justifyContent: "center",
                mt: 2,
                "& .MuiFormControlLabel-root": {
                  color: mode === "light" ? "#333465" : "#e0e0e0", // Radio button text color
                },
              }}
            >
              <FormControlLabel
                value="student"
                control={<Radio />}
                label="Student"
              />
              <FormControlLabel
                value="teacher"
                control={<Radio />}
                label="Teacher"
              />
            </RadioGroup>

            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                "&:hover": {
                  backgroundColor: mode === "light" ? "#333465" : "#b6b7ff", // Button hover color
                },
              }}
              fullWidth
              color={mode === "light" ? "primary" : "secondary"} // Button color based on mode
            >
              Sign Up
            </Button>
            <Button sx={{ mt: 2 }} onClick={() => navigate("/login")}>
              Already have an account? Log in
            </Button>
          </Box>

          {/* Show teacher access code only after the form is submitted and the role is teacher */}
          {isSubmitted && formData.role === "teacher" && (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: mode === "light" ? "#e3f2fd" : "#44476a",
                color: mode === "light" ? "#0d47a1" : "#ffffff",
              }}
            >
              Your teacher access code is <strong>123</strong>
              <Tooltip title="Copy code" arrow>
                <IconButton
                  onClick={() => {
                    navigator.clipboard.writeText("123");
                  }}
                  sx={{
                    ml: 2,
                    color: mode === "light" ? "#0d47a1" : "#ffffff",
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Alert>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
