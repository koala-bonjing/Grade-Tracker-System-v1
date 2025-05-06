import { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/Dashboard";
import StudentGrades from "./pages/StudentGrades";
import TeacherGrading from "./pages/TeacherGrading";
import Navbar from "./components/Navbar";
import SubjectGrades from "./pages/SubjectGrades";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "@fontsource/poppins";

function App() {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) return savedMode;

    // Default to system's theme preference
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const toggleMode = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode); // Persist theme in localStorage
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "light" ? "#333465" : "#b6b7ff", // Dark navy for light, soft violet for dark
            light: mode === "light" ? "#ffffff" : "#2c2c2c",
            dark: mode === "light" ? "#d8d8d8" : "#3a3a3a",
            contrastText: "#ffffff",
          },
          secondary: {
            main: mode === "light" ? "#e81921" : "#ff7276", // Vibrant red for light, softer red for dark
            light: mode === "light" ? "#f7f7f7" : "#5e1e1e",
            dark: mode === "light" ? "#ededed" : "#a02c2c",
            contrastText: "#ffffff",
          },
          background: {
            default: mode === "light" ? "#ffffff" : "#121212",
            paper: mode === "light" ? "#f7f7f7" : "#1e1e1e",
          },
          text: {
            primary: mode === "light" ? "#333465" : "#e0e0e0",
            secondary: mode === "light" ? "#47476b" : "#b0b0b0",
          },
        },
        typography: {
          fontFamily: "Poppins, sans-serif",
          h1: { fontWeight: 700, fontSize: "2.5rem" },
          h2: { fontWeight: 600, fontSize: "2rem" },
          body1: { fontWeight: 400, fontSize: "1rem" },
          button: { textTransform: "none" },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                padding: "10px 20px",
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar toggleMode={toggleMode} mode={mode} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/student-grades" element={<StudentGrades />} />
          <Route path="/teacher-grading" element={<TeacherGrading />} />
          <Route path="/subject-grades" element={<SubjectGrades />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
