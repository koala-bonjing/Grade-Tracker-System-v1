import { useEffect, useState } from "react";
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

// Register all the necessary chart.js components
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

// Enhanced chart component with multiple chart types
function GradeChart({ grades, chartType, gwa }) {
  // Generate vibrant colors with good contrast
  const generateColors = (count) => {
    const baseColors = [
      "#FF6384", // Pink
      "#36A2EB", // Blue
      "#FFCE56", // Yellow
      "#4BC0C0", // Teal
      "#9966FF", // Purple
      "#FF9F40", // Orange
      "#8AC926", // Green
      "#FF66A1", // Pink-red
      "#1982C4", // Blue-mid
      "#6A4C93", // Purple-dark
    ];

    // If we need more colors than our base set, generate more
    const colors = [...baseColors];

    if (count > colors.length) {
      for (let i = colors.length; i < count; i++) {
        const hue = (i * 137.5) % 360; // Golden angle to get good distribution
        colors.push(`hsl(${hue}, 70%, 60%)`);
      }
    }

    return {
      backgroundColor: colors.slice(0, count).map((color) => `${color}CC`), // CC = 80% opacity
      borderColor: colors.slice(0, count),
    };
  };

  const { backgroundColor, borderColor } = generateColors(grades.length);

  // Common data for all chart types
  const labels = grades.map((grade) => grade.subject);
  const values = grades.map((grade) => parseFloat(grade.grade));

  // Pie/Doughnut chart specific options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          boxWidth: 15,
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.formattedValue || "";
            return `${label}: ${value}`;
          },
        },
      },
    },
    // Add center text plugin for GWA
    elements: {
      center: {
        text: `GWA: ${gwa.toFixed(2)}`,
        color: "#000",
        fontStyle: "Arial",
        sidePadding: 20,
        minFontSize: 20,
        lineHeight: 25,
      },
    },
  };

  // Bar/Line chart specific options
  const barLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Grade: ${context.formattedValue}`;
          },
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
        },
      },
      x: {
        title: {
          display: true,
          text: "Subject",
        },
      },
    },
  };

  // Configure datasets for different chart types
  const pieData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderColor,
        borderWidth: 1,
        cutout: "70%",
      },
    ],
  };

  const barData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  const lineData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: backgroundColor,
        pointBorderColor: borderColor,
        pointHoverRadius: 6,
        tension: 0.3,
      },
    ],
  };

  // Plugin to add GWA text in the center of doughnut chart
  const textCenterPlugin = {
    id: "textCenter",
    beforeDraw: function (chart) {
      if (chart.config.type === "doughnut") {
        // Get ctx from chart
        const ctx = chart.ctx;

        // Get options from the center object in options
        const centerConfig = chart.options.elements.center;
        if (centerConfig) {
          const fontStyle = centerConfig.fontStyle || "Arial";
          const fontSize = centerConfig.minFontSize || 20;
          const txt = centerConfig.text;
          const color = centerConfig.color || "#000";
          const paddingLeft = centerConfig.sidePadding || 20;
          const paddingRight = centerConfig.sidePadding || 20;
          const lineHeight = centerConfig.lineHeight || 25;

          // Set font settings
          ctx.font = `bold ${fontSize}px ${fontStyle}`;
          ctx.fillStyle = color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Get the center position
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

          // Draw text
          ctx.fillText(txt, centerX, centerY);
        }
      }
    },
  };

  // Register the plugin
  ChartJS.register(textCenterPlugin);

  // Render the appropriate chart based on chartType
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

  // Quarters for the dropdown
  const quarters = ["PRELIM", "MIDTERM", "PRE-FINALS", "FINALS"];

  useEffect(() => {
    fetch("/student.json")
      .then((response) => response.json())
      .then((data) => {
        const johnDoe = data.students.find(
          (student) => student.name === "John Doe"
        );

        if (johnDoe) {
          setStudent(johnDoe);
          calculateAverage(johnDoe);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
        setLoading(false);
      });
  }, []);

  const calculateAverage = (studentData) => {
    const grades = studentData.subjects.map(
      (subject) =>
        subject.assignments + subject.quizzes + subject.projects + subject.exams
    );
    const totalGrades = grades.reduce((sum, grade) => sum + grade, 0);
    const averageGrade = totalGrades / (grades.length * 4);

    setAverage(averageGrade);
  };

  const handleQuarterChange = (event) => {
    setQuarter(event.target.value);
  };

  const handleChartTypeChange = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const studentGrades = student.subjects.map((subject) => ({
    subject: subject.subject,
    grade: (
      (subject.assignments +
        subject.quizzes +
        subject.projects +
        subject.exams) /
      4
    ).toFixed(2),
    feedback: subject.feedback,
  }));

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
        <Typography variant="h4" component="h1">
          {quarter} GRADES
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel id="quarter-select-label">Quarter</InputLabel>
            <Select
              labelId="quarter-select-label"
              id="quarter-select"
              value={quarter}
              label="Quarter"
              onChange={handleQuarterChange}
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
            onChange={handleChartTypeChange}
            aria-label="chart type"
            size="small"
          >
            <ToggleButton value="pie" aria-label="pie chart">
              <PieChartIcon />
            </ToggleButton>
            <ToggleButton value="doughnut" aria-label="doughnut chart">
              <DonutLargeIcon />
            </ToggleButton>
            <ToggleButton value="bar" aria-label="bar chart">
              <BarChartIcon />
            </ToggleButton>
            <ToggleButton value="line" aria-label="line chart">
              <ShowChartIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        <Paper sx={{ p: 3, flex: 1, display: "flex", flexDirection: "column" }}>
          <Typography variant="h5" gutterBottom>
            Grades Distribution
          </Typography>
          <GradeChart
            grades={studentGrades}
            chartType={chartType}
            gwa={average}
          />
        </Paper>

        <Paper sx={{ p: 3, flex: 2 }}>
          <Typography variant="h6" gutterBottom>
            Grade Details for {student.name}
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
                {studentGrades.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.subject}</TableCell>
                    <TableCell align="right">{row.grade}</TableCell>
                    <TableCell>{row.feedback}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6">GWA</Typography>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                p: 1,
                bgcolor:
                  average >= 85
                    ? "#d4edda"
                    : average >= 75
                    ? "#fff3cd"
                    : "#f8d7da",
                color:
                  average >= 85
                    ? "#155724"
                    : average >= 75
                    ? "#856404"
                    : "#721c24",
                borderRadius: 1,
              }}
            >
              {average.toFixed(2)}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
