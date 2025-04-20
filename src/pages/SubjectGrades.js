import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
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

  useEffect(() => {
    fetch("/student.json")
      .then((res) => res.json())
      .then((data) => {
        setStudentData(data.students[0]);
      });
  }, []);

  if (!studentData) {
    return <CircularProgress />;
  }

  const renderChart = (data) => {
    switch (chartType) {
      case "bar":
        return <Bar data={data} options={{ maintainAspectRatio: false }} />;
      case "line":
        return <Line data={data} options={{ maintainAspectRatio: false }} />;
      default:
        return (
          <Doughnut data={data} options={{ maintainAspectRatio: false }} />
        );
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Typography variant="h4" gutterBottom>
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
                borderColor: "#333",
                borderWidth: 1,
                tension: 0.4,
              },
            ],
          };

          return (
            <Grid item xs={12} md={6} lg={4} key={subj.code}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{subj.subject}</Typography>
                  <div style={{ width: "100%", height: 250 }}>
                    {renderChart(data)}
                  </div>
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
    </div>
  );
}

export default SubjectGrades;
