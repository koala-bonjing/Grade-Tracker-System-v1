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
  Divider,
  Button,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    fetch("/students.json")
      .then((res) => res.json())
      .then((data) => {
        const johnDoe = data.students.find((s) => s.name === "John Doe");
        setStudent(johnDoe);
      });
  }, []);

  if (!student) return <Typography>Loading...</Typography>;

  const subjectsWithTotal = student.subjects.map((subject) => {
    const { prelim, midterm, preFinal, final } = subject;
    const total = (prelim + midterm + preFinal + final) / 4;
    const progressed = final >= prelim;
    const status = progressed
      ? { label: "📈", color: "green", fontSize: "1.3rem" }
      : { label: "📉", color: "red", fontSize: "1.3rem" };

    return {
      ...subject,
      total: total.toFixed(2),
      status,
    };
  });

  const gwa =
    subjectsWithTotal.reduce((acc, subj) => acc + parseFloat(subj.total), 0) /
    subjectsWithTotal.length;

  // Color-coded line chart
  const lineLabels = subjectsWithTotal.map((s) => s.subject);
  const points = subjectsWithTotal.map((s) => parseFloat(s.total));

  const getColor = (gwa) => {
    if (gwa >= 90) return "rgba(75, 192, 75, 0.8)"; // Green
    if (gwa >= 85) return "rgba(54, 162, 235, 0.8)"; // Blue
    if (gwa >= 80) return "rgba(255, 159, 64, 0.8)"; // Orange
    return "rgba(255, 99, 132, 0.8)"; // Red
  };

  // Create a legend for the color codes
  const colorLegend = [
    { label: "Excellent (90+)", color: "rgba(75, 192, 75, 0.8)" },
    { label: "Very Good (85-89)", color: "rgba(54, 162, 235, 0.8)" },
    { label: "Good (80-84)", color: "rgba(255, 159, 64, 0.8)" },
    { label: "Needs Improvement (<80)", color: "rgba(255, 99, 132, 0.8)" },
  ];

  const lineChartData = {
    labels: lineLabels,
    datasets: [
      {
        label: "Subject GWA",
        data: points,
        backgroundColor: points.map((p) => getColor(p)),
        borderColor: points.map((p) => getColor(p)),
        pointRadius: 8,
        pointHoverRadius: 10,
        borderWidth: 2,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw}`;
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

  const handlePreviousSubject = () => {
    setActiveSubjectIndex((prev) =>
      prev === 0 ? subjectsWithTotal.length - 1 : prev - 1
    );
  };

  const handleNextSubject = () => {
    setActiveSubjectIndex((prev) =>
      prev === subjectsWithTotal.length - 1 ? 0 : prev + 1
    );
  };

  const activeSubject = subjectsWithTotal[activeSubjectIndex];

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" gutterBottom>
        {student.name}'s Grade Dashboard
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4, border: "1px solid #ccc" }}>
        <Typography variant="h5" gutterBottom>
          General Weighted Average (GWA)
        </Typography>
        <Typography variant="h3" color="primary">
          {gwa.toFixed(2)}
        </Typography>
      </Paper>

      {/* Line chart - always visible */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, border: "1px solid #ccc" }}>
        <Typography variant="h6" gutterBottom>
          Subject GWA Overview
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ height: 250 }}>
          <Line data={lineChartData} options={lineChartOptions} />
        </Box>

        {/* Color legend */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {colorLegend.map((item, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  backgroundColor: item.color,
                  borderRadius: "50%",
                }}
              ></Box>
              <Typography variant="body2">{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Subject details - full table on desktop, single subject view on mobile */}
      <Paper elevation={3} sx={{ p: 2, mb: 4, border: "1px solid #ccc" }}>
        <Typography variant="h6" gutterBottom>
          Subject Grades
        </Typography>

        {!isMobile ? (
          // Full table view for desktop
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Subject</TableCell>
                  <TableCell align="right">Prelim</TableCell>
                  <TableCell align="right">Midterm</TableCell>
                  <TableCell align="right">Pre-Final</TableCell>
                  <TableCell align="right">Final</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right">Status</TableCell>
                  <TableCell>Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subjectsWithTotal.map((subj) => (
                  <TableRow key={subj.code}>
                    <TableCell>{subj.subject}</TableCell>
                    <TableCell align="right">{subj.prelim}</TableCell>
                    <TableCell align="right">{subj.midterm}</TableCell>
                    <TableCell align="right">{subj.preFinal}</TableCell>
                    <TableCell align="right">{subj.final}</TableCell>
                    <TableCell align="right">{subj.total}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        color: subj.status.color,
                        fontSize: subj.status.fontSize,
                        fontWeight: 500,
                      }}
                    >
                      {subj.status.label}
                    </TableCell>
                    <TableCell>{subj.feedback}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          // Single subject view with navigation for mobile
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <IconButton onClick={handlePreviousSubject}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="subtitle1">
                {activeSubject.subject} ({activeSubjectIndex + 1}/
                {subjectsWithTotal.length})
              </Typography>
              <IconButton onClick={handleNextSubject}>
                <ArrowForwardIcon />
              </IconButton>
            </Box>

            <Table>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Prelim:
                  </TableCell>
                  <TableCell align="right">{activeSubject.prelim}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Midterm:
                  </TableCell>
                  <TableCell align="right">{activeSubject.midterm}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Pre-Final:
                  </TableCell>
                  <TableCell align="right">{activeSubject.preFinal}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Final:
                  </TableCell>
                  <TableCell align="right">{activeSubject.final}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Total:
                  </TableCell>
                  <TableCell align="right">{activeSubject.total}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Status:
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      color: activeSubject.status.color,
                      fontSize: activeSubject.status.fontSize,
                      fontWeight: 500,
                    }}
                  >
                    {activeSubject.status.label}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    Feedback:
                  </TableCell>
                  <TableCell>{activeSubject.feedback}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
