import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  useTheme,
} from "@mui/material";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
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
import PieChartIcon from "@mui/icons-material/PieChart";
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

function GradeChart({ grades, chartType, gwa }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const generateColors = (count) => {
    const baseColors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#8AC926",
      "#FF66A1",
      "#1982C4",
      "#6A4C93",
    ];

    const colors = [...baseColors];
    if (count > colors.length) {
      for (let i = colors.length; i < count; i++) {
        const hue = (i * 137.5) % 360;
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
    }

    return {
      backgroundColor: colors.slice(0, count).map((c) => `${c}CC`),
      borderColor: colors.slice(0, count),
    };
  };

  const { backgroundColor, borderColor } = generateColors(grades.length);
  const labels = grades.map((g) => g.subject);
  const values = grades.map((g) => parseFloat(g.grade));

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDark ? "#fff" : "#000",
          boxWidth: 15,
          padding: 15,
          font: { size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}: ${ctx.formattedValue}`,
        },
      },
    },
    elements: {
      center: {
        text: `GWA: ${gwa.toFixed(2)}`,
        color: theme.palette.text.primary,
        fontStyle: "Arial",
        sidePadding: 20,
        minFontSize: 20,
        lineHeight: 25,
      },
    },
  };

  const barLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `Grade: ${ctx.formattedValue}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Grade",
          color: theme.palette.text.primary,
        },
        ticks: { color: isDark ? "#fff" : "#000" },
      },
      x: {
        title: {
          display: true,
          text: "Subject",
          color: theme.palette.text.primary,
        },
        ticks: { color: isDark ? "#fff" : "#000" },
      },
    },
  };

  const pieData = {
    labels,
    datasets: [{ data: values, backgroundColor, borderColor, borderWidth: 1 }],
  };

  const doughnutData = {
    ...pieData,
    datasets: [{ ...pieData.datasets[0], cutout: "70%" }],
  };

  const barData = pieData;
  const lineData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 2,
        pointBackgroundColor: backgroundColor,
        pointBorderColor: borderColor,
        pointHoverRadius: 6,
        tension: 0.3,
      },
    ],
  };

  const textCenterPlugin = {
    id: "textCenter",
    beforeDraw: (chart) => {
      if (chart.config.type === "doughnut") {
        const ctx = chart.ctx;
        const centerConfig = chart.options.elements.center;
        if (centerConfig) {
          ctx.font = `bold ${centerConfig.minFontSize || 20}px ${
            centerConfig.fontStyle || "Arial"
          }`;
          ctx.fillStyle = centerConfig.color || "#000";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.fillText(centerConfig.text, centerX, centerY);
        }
      }
    },
  };

  ChartJS.register(textCenterPlugin);

  return (
    <Box sx={{ height: 300, position: "relative" }}>
      {chartType === "pie" && <Pie data={pieData} options={pieOptions} />}
      {chartType === "doughnut" && (
        <Doughnut data={doughnutData} options={pieOptions} />
      )}
      {chartType === "bar" && <Bar data={barData} options={barLineOptions} />}
      {chartType === "line" && (
        <Line data={lineData} options={barLineOptions} />
      )}
    </Box>
  );
}

export default function StudentGrades() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [average, setAverage] = useState(0);
  const [quarter, setQuarter] = useState("PRELIM");
  const [chartType, setChartType] = useState("doughnut");

  const quarters = ["PRELIM", "MIDTERM", "PRE-FINALS", "FINALS"];

  useEffect(() => {
    fetch("/student.json")
      .then((res) => res.json())
      .then((data) => {
        const john = data.students.find(
          (s) => s.name === "Selwyn Paul Taloza Smith"
        );
        if (john) {
          setStudent(john);
          calculateAverage(john);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const calculateAverage = (studentData) => {
    const grades = studentData.subjects.map(
      (s) => s.assignments + s.quizzes + s.projects + s.exams
    );
    const total = grades.reduce((a, b) => a + b, 0);
    setAverage(total / (grades.length * 4));
  };

  const studentGrades =
    student?.subjects.map((s) => ({
      subject: s.subject,
      grade: ((s.assignments + s.quizzes + s.projects + s.exams) / 4).toFixed(
        2
      ),
      feedback: s.feedback,
    })) || [];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4">{quarter} GRADES</Typography>

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Quarter</InputLabel>
            <Select
              value={quarter}
              label="Quarter"
              onChange={(e) => setQuarter(e.target.value)}
              size="small"
            >
              {quarters.map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(e, val) => val && setChartType(val)}
            size="small"
          >
            <ToggleButton value="pie">
              <PieChartIcon />
            </ToggleButton>
            <ToggleButton value="doughnut">
              <DonutLargeIcon />
            </ToggleButton>
            <ToggleButton value="bar">
              <BarChartIcon />
            </ToggleButton>
            <ToggleButton value="line">
              <ShowChartIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Paper sx={{ p: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>
              Grade Chart
            </Typography>
            <GradeChart
              grades={studentGrades}
              chartType={chartType}
              gwa={average}
            />
          </Paper>

          <Paper sx={{ p: 3, flex: 2 }}>
            <Typography variant="h6" gutterBottom>
              {student
                ? `Grade Details for ${student.name}`
                : "No student data available."}
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell align="right">Grade</TableCell>
                    <TableCell>Feedback</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentGrades.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.subject}</TableCell>
                      <TableCell align="right">{row.grade}</TableCell>
                      <TableCell>{row.feedback}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      )}
    </Box>
  );
}
