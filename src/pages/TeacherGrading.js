import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import * as XLSX from "xlsx";

export default function TeacherGrading() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const assessments = ["assignments", "quizzes", "projects", "exams"];

  // Fetching the student data
  useEffect(() => {
    fetch("/student.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Loaded students:", data.students); // Add this for debugging
        setStudents(data.students);
      })
      .catch((err) => console.error("Failed to load student data", err));
  }, []);

  // Handling changes in grade input fields
  const handleGradeChange = (subjectIndex, field, value) => {
    const updated = { ...selectedStudent };
    updated.subjects[subjectIndex][field] = value;
    setSelectedStudent(updated);
  };

  // Handling changes in feedback
  const handleFeedbackChange = (subjectIndex, value) => {
    const updated = { ...selectedStudent };
    updated.subjects[subjectIndex].feedback = value;
    setSelectedStudent(updated);
  };

  // Submit individual subject grades and feedback
  const handleSubjectSubmit = (subjectIndex) => {
    const updatedStudents = students.map((s) =>
      s.id === selectedStudent.id
        ? {
            ...selectedStudent,
            subjects: selectedStudent.subjects.map((subj, idx) =>
              idx === subjectIndex ? { ...subj } : subj
            ),
          }
        : s
    );
    setStudents(updatedStudents);
    alert(
      `Grades saved for ${selectedStudent.name} - ${selectedStudent.subjects[subjectIndex].subject}`
    );
  };

  // File upload handler for importing grades
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = XLSX.utils.sheet_to_json(worksheet);

      const imported = parsed.map((row, idx) => ({
        id: idx + 1,
        name: row.Name,
        subjects: [
          {
            subject: "Mathematics",
            code: "MATH101",
            assignments: Number(row.Assignments) || 0,
            quizzes: Number(row.Quizzes) || 0,
            projects: Number(row.Projects) || 0,
            exams: Number(row.Exams) || 0,
            feedback: row.Feedback || "",
          },
        ],
      }));

      setStudents(imported);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Teacher Grading Panel
      </Typography>

      <TextField
        type="file"
        fullWidth
        onChange={handleFileUpload}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        variant="outlined"
      />

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Student List */}
        <Paper
          sx={{
            flex: 1,
            p: 2,
            position: "sticky", // Keep the student list fixed
            top: 20, // Adjust this value based on your design
            height: "calc(100vh - 60px)", // Set height to fit screen, minus padding
            overflowY: "auto", // Allow scrolling for the list if needed
          }}
        >
          <Typography variant="h6">Students</Typography>
          <List>
            {students.map((student) => (
              <ListItem
                key={student.id}
                button
                selected={selectedStudent?.id === student.id}
                onClick={() => setSelectedStudent(student)}
              >
                <ListItemText primary={student.name} />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Student Details */}
        <Paper sx={{ flex: 2, p: 2 }}>
          {selectedStudent ? (
            <>
              <Typography variant="h6" gutterBottom>
                Grading {selectedStudent.name}
              </Typography>

              {/* Check if `selectedStudent.subjects` exists */}
              {selectedStudent.subjects &&
              selectedStudent.subjects.length > 0 ? (
                selectedStudent.subjects.map((subj, idx) => (
                  <Box key={idx} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {subj.subject} ({subj.code})
                    </Typography>

                    {assessments.map((field) => (
                      <TextField
                        key={field}
                        label={`${subj.subject} - ${
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }`}
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={subj[field] || ""}
                        onChange={(e) =>
                          handleGradeChange(idx, field, e.target.value)
                        }
                      />
                    ))}
                    <TextField
                      label="Feedback"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      sx={{ mb: 2 }}
                      value={subj.feedback || ""}
                      onChange={(e) =>
                        handleFeedbackChange(idx, e.target.value)
                      }
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleSubjectSubmit(idx)}
                    >
                      Save Grades
                    </Button>
                  </Box>
                ))
              ) : (
                <Typography>No subjects found for this student.</Typography>
              )}
            </>
          ) : (
            <Typography>Select a student to view details.</Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
