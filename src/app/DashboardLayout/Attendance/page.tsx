//@ts-nocheck
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DashboardCard from "@/app/DashboardLayout/components/shared/DashboardCard";
import TableContainer from "@mui/material/TableContainer";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";

const Pagination = ({ currentPage, totalPages }) => (
  <Box mt={2} display="flex" justifyContent="center">
    <Typography
      variant="subtitle1"
      color="primary"
    >{`Page ${currentPage} of ${totalPages}`}</Typography>
  </Box>
);

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    emailAddress: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhoneNumber: "",
    emergencyContactRelationship: "",
    medicalInformation: "",
    additionalNotes: "",
    attendance: "Present", // Default value for attendance
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const studentsPerPage = 6;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("https://sms-1-a8o4.onrender.com/getStudent");
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setError("Error fetching students. Please try again later.");
        setLoading(false);
      }
    };

    const fetchAttendance = async () => {
      try {
        const response = await axios.get("https://sms-1-a8o4.onrender.com/getAttendance");
        setAttendanceData(response.data);
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchStudents();
    fetchAttendance();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = async () => {
    try {
      let response;
      if (editStudentId) {
        response = await axios.put(
          `https://sms-1-a8o4.onrender.com/updateStudent/${editStudentId}`,
          formData
        );
        setStudents(
          students.map((student) =>
            student.studentId === editStudentId ? response.data : student
          )
        );
      } else {
        response = await axios.post(
          "https://sms-1-a8o4.onrender.com/postStudent",
          formData
        );
        setStudents([...students, response.data]);
      }
      setSnackbarOpen(true);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding/updating student:", error);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const handleNextPage = async () => {
    setPaginationLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentPage(currentPage + 1);
    } finally {
      setPaginationLoading(false);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleEdit = (studentId) => {
    const studentToEdit = students.find(
      (student) => student.studentId === studentId
    );
    setFormData({
      name: studentToEdit.name,
      phoneNumber: studentToEdit.phoneNumber,
      emailAddress: studentToEdit.emailAddress,
      address: studentToEdit.address,
      emergencyContactName: studentToEdit.emergencyContactName,
      emergencyContactPhoneNumber: studentToEdit.emergencyContactPhoneNumber,
      emergencyContactRelationship: studentToEdit.emergencyContactRelationship,
      medicalInformation: studentToEdit.medicalInformation,
      additionalNotes: studentToEdit.additionalNotes,
      attendance: studentToEdit.attendance, // Set attendance from existing data
    });
    setEditStudentId(studentId);
    setIsModalOpen(true);
  };

  const markAttendance = async (studentId, attendanceStatus) => {
    try {
      await axios.post("https://sms-1-a8o4.onrender.com/postAttendance", {
        student_id: studentId,
        date: new Date(), // You might want to send the current date
        status: attendanceStatus,
      });
      setSnackbarOpen(true);
      // Update the attendance status in the local state
      setStudents(
        students.map((student) =>
          student.studentId === studentId
            ? { ...student, attendance: attendanceStatus }
            : student
        )
      );
      // Fetch updated attendance data
      const response = await axios.get("https://sms-1-a8o4.onrender.com/getAttendance");
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error marking attendance:", error);
      setSnackbarOpen(true);
    }
  };

  return (
    <div>
      <style>
        {`
          .odd-row {
            background-color: #F0F5F9;
          }
          .table-head-bgc {
            background-color: #E5F3FB;
          }
        `}
      </style>
      <DashboardCard title="Students">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <TextField
              variant="outlined"
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton disabled>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <IconButton
            color="primary"
            aria-label="add student"
            onClick={() => {
              setIsModalOpen(true);
              setFormData({
                ...formData,
                name: "",
                phoneNumber: "",
                emailAddress: "",
                address: "",
                emergencyContactName: "",
                emergencyContactPhoneNumber: "",
                emergencyContactRelationship: "",
                medicalInformation: "",
                additionalNotes: "",
                attendance: "Present", // Default value for attendance
              });
            }}
          >
            {/* <AddIcon /> */}
          </IconButton>
        </Box>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="200px"
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="subtitle2" color="error">
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow className={"table-head-bgc"}>
                  <TableCell>
                    <Typography variant="subtitle1">
                      <b>ID</b>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      <b>Name</b>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      <b>Email</b>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      <b>Attendance</b>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentStudents.map((student, index) => {
                  const attendanceRecord = attendanceData.find(
                    (record) => record.student.studentId === student.studentId
                  );
                  console.log(attendanceRecord);
                  const rowNum = indexOfFirstStudent + index + 1; // Calculate row number
                  const today = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
                  // console.log(today)

                  let displayMarkAttendance = true; // Flag to determine whether to display mark attendance icons
                  if (
                    attendanceRecord &&
                    attendanceRecord.date.slice(0, 10) === today
                  ) {
                    // If attendance has already been marked for today, don't display mark attendance icons
                    displayMarkAttendance = false;
                  }
                  console.log(displayMarkAttendance);

                  return (
                    <TableRow
                      key={student.studentId}
                      className={index % 2 !== 0 ? "odd-row" : ""}
                    >
                      <TableCell>{rowNum}</TableCell> {/* Render row number */}
                      <TableCell>{student.name || "-"}</TableCell>
                      <TableCell>{student.emailAddress || "-"}</TableCell>
                      <TableCell>
                        {displayMarkAttendance ? (
                          <Box display="flex" alignItems="center">
                            <IconButton
                              onClick={() =>
                                markAttendance(student.studentId, "Present")
                              }
                            >
                              <CheckCircle color="primary" />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                markAttendance(student.studentId, "Absent")
                              }
                            >
                              <Cancel color="error" />
                            </IconButton>
                          </Box>
                        ) : (
                          <Typography
                            variant="subtitle1"
                            color={
                              attendanceRecord &&
                              attendanceRecord.status === "Present"
                                ? "primary"
                                : "error"
                            }
                          >
                            {attendanceRecord && attendanceRecord.status}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          message="Operation completed successfully!"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        />
      </DashboardCard>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add/Edit Student</DialogTitle>
        <DialogContent>{/* Your form fields go here */}</DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddStudent} color="primary">
            {editStudentId ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
