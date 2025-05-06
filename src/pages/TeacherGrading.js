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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Fab,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

export default function TeacherGrading() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [block, setBlock] = useState("");
  const [course, setCourse] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [gradingPeriod, setGradingPeriod] = useState("");

  const assessments = ["assignments", "quizzes", "projects", "exams"];

  const [newStudent, setNewStudent] = useState({
    name: "",
    course: "",
    block: "",
    subjects: [],
  });

  const handleNewStudentChange = (field, value) => {
    setNewStudent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewSubjectChange = (index, field, value) => {
    const updatedSubjects = [...newStudent.subjects];
    updatedSubjects[index][field] = value;
    setNewStudent({ ...newStudent, subjects: updatedSubjects });
  };

  const handleSaveNewStudent = () => {
    setStudents((prev) => [...prev, newStudent]); // Add the new student
    setAddDialogOpen(false); // Close the dialog after saving
    setSnackbarMessage("Student added successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  useEffect(() => {
    fetch("/student.json")
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []))
      .catch((err) => console.error("Failed to load student data", err));
  }, []);

  const [addSubjectDialogOpen, setAddSubjectDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subject: "",
    code: "",
    assignments: 0,
    quizzes: 0,
    projects: 0,
    exams: 0,
    feedback: "",
  });
  const [subjectToDeleteIndex, setSubjectToDeleteIndex] = useState(null);
  const [deleteSubjectConfirmOpen, setDeleteSubjectConfirmOpen] =
    useState(false);

  const handleAddSubject = () => {
    setNewSubject({
      subject: "",
      code: "",
      assignments: 0,
      quizzes: 0,
      projects: 0,
      exams: 0,
      feedback: "",
    });
    setAddSubjectDialogOpen(true);
  };

  const handleSaveNewSubject = () => {
    if (selectedStudent && newSubject.subject && newSubject.code) {
      const updatedStudent = {
        ...selectedStudent,
        subjects: [...selectedStudent.subjects, newSubject],
      };
      setSelectedStudent(updatedStudent);
      setStudents((prev) =>
        prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );
      setAddSubjectDialogOpen(false);
      setSnackbarMessage("Subject added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      setSnackbarMessage("Subject name and code are required!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleNewSubjectInputChange = (field, value) => {
    setNewSubject((prev) => ({
      ...prev,
      [field]:
        field === "subject" || field === "code" || field === "feedback"
          ? value
          : Number(value),
    }));
  };

  const handleSubjectDeleteClick = (index) => {
    setSubjectToDeleteIndex(index);
    setDeleteSubjectConfirmOpen(true);
  };

  const handleDeleteSubject = () => {
    if (selectedStudent && subjectToDeleteIndex !== null) {
      const updatedStudent = {
        ...selectedStudent,
        subjects: selectedStudent.subjects.filter(
          (_, i) => i !== subjectToDeleteIndex
        ),
      };
      setSelectedStudent(updatedStudent);
      setStudents((prev) =>
        prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
      );
      setSnackbarMessage("Subject deleted successfully!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
    setDeleteSubjectConfirmOpen(false);
    setSubjectToDeleteIndex(null);
  };

  const handleStudentDeleteClick = (studentId) => {
    setStudentToDelete(studentId);
    setConfirmationOpen(true);
  };

  const handleDeleteStudent = () => {
    setStudents((prev) =>
      prev.filter((student) => student.id !== studentToDelete)
    );

    // If the deleted student was selected, clear the selection
    if (selectedStudent && selectedStudent.id === studentToDelete) {
      setSelectedStudent(null);
    }

    setSnackbarMessage("Student deleted successfully!");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
    setConfirmationOpen(false);
  };

  const handleSaveGrades = () => {
    console.log("Grades saved:", selectedStudent);
    setSnackbarMessage("Grades saved successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Teacher Grading Panel
      </Typography>

      {/* Select Course and Block */}
      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row" },
          mb: 3,
        }}
      >
        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={course}
            onChange={(e) => {
              setCourse(e.target.value);
              setBlock("");
            }}
          >
            {students
              .map((student) => student.course)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((course) => (
                <MenuItem key={course} value={course}>
                  {course}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ maxWidth: 300 }}>
          <InputLabel>Block</InputLabel>
          <Select value={block} onChange={(e) => setBlock(e.target.value)}>
            {students
              .filter((student) => student.course === course)
              .map((student) => student.block)
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((block) => (
                <MenuItem key={block} value={block}>
                  {block}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel>Grading Period</InputLabel>
          <Select
            value={gradingPeriod}
            label="Grading Period"
            onChange={(e) => setGradingPeriod(e.target.value)}
          >
            <MenuItem value="Prelim">Prelim</MenuItem>
            <MenuItem value="Midterm">Midterm</MenuItem>
            <MenuItem value="Pre-Finals">Pre-Finals</MenuItem>
            <MenuItem value="Finals">Finals</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Student List */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Students</Typography>
        <List>
          {students
            .filter(
              (student) => student.course === course && student.block === block
            )
            .map((student) => (
              <ListItem
                key={student.id}
                button
                selected={selectedStudent?.id === student.id}
                onClick={() => setSelectedStudent(student)}
              >
                <ListItemText primary={student.name} />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent selecting the student when clicking delete
                    handleStudentDeleteClick(student.id);
                  }}
                  sx={{
                    ":hover": { backgroundColor: "#f44336", color: "#fff" },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
        </List>
      </Paper>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this student?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteStudent}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Subject Grade Entry */}
      {selectedStudent && (
        <Paper sx={{ p: 2, mb: 10 }}>
          <Typography variant="h6">{selectedStudent.name}'s Grades</Typography>
          {selectedStudent.subjects.map((subj, i) => (
            <Box key={i} sx={{ my: 2 }}>
              <Typography>
                {subj.subject} ({subj.code})
              </Typography>
              {assessments.map((a) => (
                <TextField
                  key={a}
                  label={a}
                  type="text"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  value={subj[a]}
                  sx={{ mr: 2, my: 1 }}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : Number(e.target.value);
                    if (!isNaN(value)) {
                      const updated = { ...selectedStudent };
                      updated.subjects[i][a] = value;
                      setSelectedStudent(updated);

                      setStudents((prev) =>
                        prev.map((s) => (s.id === updated.id ? updated : s))
                      );
                    }
                  }}
                />
              ))}
              <TextField
                label="Feedback"
                value={subj.feedback}
                fullWidth
                onChange={(e) => {
                  const updated = { ...selectedStudent };
                  updated.subjects[i].feedback = e.target.value;
                  setSelectedStudent(updated);

                  setStudents((prev) =>
                    prev.map((s) => (s.id === updated.id ? updated : s))
                  );
                }}
              />
              <IconButton
                color="error"
                onClick={() => handleSubjectDeleteClick(i)}
                sx={{ mt: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddSubject}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#115293",
                transform: "scale(1.03)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Add Subject
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSaveGrades}
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#115293",
                transform: "scale(1.03)",
              },
              transition: "all 0.2s ease-in-out",
            }}
          >
            Save Grades
          </Button>
        </Paper>
      )}

      {/* Add New Student Button */}
      <Tooltip title="Add New Student">
        <Fab
          color="primary"
          onClick={() => setAddDialogOpen(true)} // Open the dialog on click
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            "&:hover": {
              backgroundColor: "#115293",
              transform: "scale(1.03)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Add Student Dialog */}
      <Dialog
        open={addDialogOpen} // This controls the dialog visibility
        onClose={() => setAddDialogOpen(false)} // Close the dialog on cancel
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add Student</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                value={newStudent.name}
                fullWidth
                onChange={(e) => handleNewStudentChange("name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course"
                value={newStudent.course}
                fullWidth
                onChange={(e) =>
                  handleNewStudentChange("course", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Block"
                value={newStudent.block}
                fullWidth
                onChange={(e) =>
                  handleNewStudentChange("block", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNewStudent} variant="contained">
            Save Student
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Subject Dialog */}
      <Dialog
        open={addSubjectDialogOpen}
        onClose={() => setAddSubjectDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Subject</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subject Name"
                value={newSubject.subject}
                fullWidth
                required
                onChange={(e) =>
                  handleNewSubjectInputChange("subject", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Subject Code"
                value={newSubject.code}
                fullWidth
                required
                onChange={(e) =>
                  handleNewSubjectInputChange("code", e.target.value)
                }
              />
            </Grid>
            {assessments.map((a) => (
              <Grid item xs={12} sm={6} key={a}>
                <TextField
                  label={a.charAt(0).toUpperCase() + a.slice(1)}
                  type="text"
                  inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
                  value={newSubject[a]}
                  fullWidth
                  onChange={(e) =>
                    handleNewSubjectInputChange(a, e.target.value)
                  }
                />
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField
                label="Feedback"
                value={newSubject.feedback}
                fullWidth
                multiline
                rows={2}
                onChange={(e) =>
                  handleNewSubjectInputChange("feedback", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSubjectDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveNewSubject} variant="contained">
            Add Subject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Subject Confirmation Dialog */}
      <Dialog
        open={deleteSubjectConfirmOpen}
        onClose={() => setDeleteSubjectConfirmOpen(false)}
      >
        <DialogTitle>Confirm Subject Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this subject? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteSubjectConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteSubject}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success/error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
