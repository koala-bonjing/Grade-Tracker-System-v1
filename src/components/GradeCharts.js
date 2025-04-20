import React, { useState } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
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
  Title,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

const chartTypes = {
  pie: "Grade Component Distribution",
  bar: "Average Grades by Subject",
  line: "Grades Over Subjects",
};

export default function GradeChart({ grades }) {
  const [chartType, setChartType] = useState("pie");

  const subjects = grades.map((g) => g.subject);
  const values = grades.map((g) => parseFloat(g.grade));

  // PIE CHART: Breakdown for the first subject (Doughnut chart)
  const firstSubject = grades[0];

  const pieData = {
    labels: ["Assignments", "Quizzes", "Projects", "Exams"],
    datasets: [
      {
        label: firstSubject.subject,
        data: [
          parseFloat(firstSubject.assignments || 0),
          parseFloat(firstSubject.quizzes || 0),
          parseFloat(firstSubject.projects || 0),
          parseFloat(firstSubject.exams || 0),
        ],
        backgroundColor: ["#42a5f5", "#66bb6a", "#ffa726", "#ef5350"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  // SHARED chart data (bar & line)
  const sharedData = {
    labels: subjects,
    datasets: [
      {
        label: "Average Grades",
        data: values,
        backgroundColor: "#42a5f5",
        borderColor: "#1e88e5",
        borderWidth: 2,
        pointRadius: 5,
        tension: 0.3, // smooth line
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: chartType === "line" ? "top" : "bottom",
      },
      title: {
        display: true,
        text: chartTypes[chartType],
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)}%`;
          },
        },
      },
      // To place the GWA in the center of the doughnut
      datalabels: {
        formatter: function (value, ctx) {
          if (ctx.datasetIndex === 0) {
            const total = ctx.dataset.data.reduce((acc, val) => acc + val, 0);
            const GWA = (total / 4).toFixed(2); // Calculate GWA
            return GWA; // Display GWA in the center
          }
          return value;
        },
        color: "#fff",
        font: {
          weight: "bold",
          size: 16,
        },
      },
    },
    scales:
      chartType !== "pie"
        ? {
            y: {
              beginAtZero: true,
              max: 100,
            },
          }
        : {},
  };

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <Bar data={sharedData} options={options} />;
      case "line":
        return <Line data={sharedData} options={options} />;
      default:
        return <Doughnut data={pieData} options={options} />;
    }
  };

  return (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Select Chart Type</InputLabel>
        <Select
          value={chartType}
          label="Select Chart Type"
          onChange={(e) => setChartType(e.target.value)}
        >
          <MenuItem value="pie">Pie Chart</MenuItem>
          <MenuItem value="bar">Bar Chart</MenuItem>
          <MenuItem value="line">Line Chart</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ width: "600px", height: "600px" }}>{renderChart()}</Box>

      {chartType === "pie" && (
        <Typography variant="caption" color="text.secondary">
          Showing breakdown for <strong>{firstSubject.subject}</strong>
        </Typography>
      )}
    </Box>
  );
}
