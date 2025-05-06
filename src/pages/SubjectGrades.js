import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  Box,
  useTheme,
} from "@mui/material";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";

// Register chart components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

function SubjectGrades() {
  const [studentData, setStudentData] = useState(null);
  const [chartType, setChartType] = useState("doughnut");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    fetch("/student.json")
      .then((res) => res.json())
      .then((data) => {
        setStudentData(data.students[0]);
      });
  }, []);

  if (!studentData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderChart = (data) => {
    const commonOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: isDark ? "#fff" : "#000",
          },
        },
      },
      scales: chartType !== "doughnut" && {
        x: {
          ticks: {
            color: isDark ? "#fff" : "#000",
          },
        },
        y: {
          ticks: {
            color: isDark ? "#fff" : "#000",
          },
        },
      },
    };

    switch (chartType) {
      case "bar":
        return <Bar data={data} options={commonOptions} />;
      case "line":
        return <Line data={data} options={commonOptions} />;
      default:
        return <Doughnut data={data} options={commonOptions} />;
    }
  };

  return (
    <Box sx={{ padding: "2rem" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: isDark ? "white" : "black" }}
      >
        {studentData.name}'s Grades Overview
      </Typography>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <IconButton
          color={chartType === "doughnut" ? "primary" : "default"}
          onClick={() => setChartType("doughnut")}
        >
          <DonutLargeIcon />
        </IconButton>
        <IconButton
          color={chartType === "bar" ? "primary" : "default"}
          onClick={() => setChartType("bar")}
        >
          <BarChartIcon />
        </IconButton>
        <IconButton
          color={chartType === "line" ? "primary" : "default"}
          onClick={() => setChartType("line")}
        >
          <ShowChartIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {studentData.subjects.map((subj) => {
          const total =
            (subj.assignments + subj.quizzes + subj.projects + subj.exams) / 4;

          const data = {
            labels: ["Assignments", "Quizzes", "Projects", "Exams"],
            datasets: [
              {
                label: subj.subject,
                data: [
                  subj.assignments,
                  subj.quizzes,
                  subj.projects,
                  subj.exams,
                ],
                backgroundColor: ["#42a5f5", "#66bb6a", "#ffa726", "#ef5350"],
                borderColor: isDark ? "#ddd" : "#333",
                borderWidth: 1,
                tension: 0.4,
              },
            ],
          };

          return (
            <Grid item xs={12} md={6} lg={4} key={subj.code}>
              <Card
                elevation={3}
                sx={{
                  backgroundColor: isDark ? "#1e1e1e" : "#fff",
                  color: isDark ? "#fff" : "#000",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{subj.subject}</Typography>
                  <Box sx={{ width: "100%", height: 250 }}>
                    {renderChart(data)}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Total:</strong> {total} / 100
                  </Typography>
                  <Typography variant="body2">
                    <strong>Feedback:</strong> {subj.feedback}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default SubjectGrades;
