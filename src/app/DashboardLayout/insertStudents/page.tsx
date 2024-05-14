//@ts-nocheck
"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { Search as SearchIcon, Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const Pagination = ({ currentPage, totalPages }) => (
  <Box mt={2} display="flex" justifyContent="center">
    <Typography variant="subtitle1" color="primary">{`Page ${currentPage} of ${totalPages}`}</Typography>
  </Box>
);

const Page = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null); // New state to store the ID of the student being edited
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    emergencyContactName: '',
    emergencyContactPhoneNumber: '',
    emergencyContactRelationship: '',
    medicalInformation: '',
    additionalNotes: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const studentsPerPage = 6;

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('https://sms-1-a8o4.onrender.com/getStudent');
        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('Error fetching students. Please try again later.');
        setLoading(false);
      }
    };

    fetchStudents();
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
        // If editStudentId is present, it means we're updating an existing student
        response = await axios.put(`https://sms-1-a8o4.onrender.com/updateStudent/${editStudentId}`, formData);
        // Update the students state with the updated student information
        setStudents(students.map((student) => (student.studentId === editStudentId ? response.data : student)));
      } else {
        // Otherwise, we're adding a new student
        response = await axios.post('https://sms-1-a8o4.onrender.com/postStudent', formData);
        // Add the new student to the students state
        setStudents([...students, response.data]);
      }
      setSnackbarOpen(true); // Show success snackbar
      setIsModalOpen(false); // Close modal
      setEditStudentId(null); // Clear editStudentId when adding a new student
    } catch (error) {
      console.error('Error adding/updating student:', error);
      setSnackbarOpen(true); // Show error snackbar
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
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const handleNextPage = async () => {
    setPaginationLoading(true); // Show loading screen for pagination
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading delay
      setCurrentPage(currentPage + 1);
    } finally {
      setPaginationLoading(false); // Hide loading screen after pagination
    }
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleEdit = (studentId) => {
    // Find the student by ID
    const studentToEdit = students.find((student) => student.studentId === studentId);
    // Set the formData state with the data of the student to edit
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
    });
    setEditStudentId(studentId); // Set the ID of the student being edited
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = async (studentId) => {
    try {
      await axios.delete(`https://sms-1-a8o4.onrender.com/deleteStudent/${studentId}`);
      // Remove the deleted student from the state
      setStudents(students.filter((student) => student.studentId !== studentId));
      setSnackbarOpen(true); // Show success snackbar
    } catch (error) {
      console.error('Error deleting student:', error);
      setSnackbarOpen(true); // Show error snackbar
    }
  };

  return (
    <div>
      <style>
        {`
          .odd-row {
            background-color: #F0F5F9; /* Light Blue */
          }
          .table-head-bgc {
            background-color: #E5F3FB;
          }
        `}
      </style>
      <DashboardCard title="Students">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
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
                name: '',
                phoneNumber: '',
                emailAddress: '',
                address: '',
                emergencyContactName: '',
                emergencyContactPhoneNumber: '',
                emergencyContactRelationship: '',
                medicalInformation: '',
                additionalNotes: '',
              });
              setEditStudentId(null); // Clear editStudentId when adding a new student
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="subtitle2" color="error">
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead className={'table-head-bgc'}>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentStudents.map((student, index) => (
                  
                  <TableRow key={student.studentId} className={index % 2 !== 0 ? 'odd-row' : ''}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.name || '-'}</TableCell>
                    <TableCell>{student.emailAddress || '-'}</TableCell>
                    <TableCell>{student.phoneNumber || '-'}</TableCell>
                    <TableCell>{student.address || '-'}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => handleEdit(student.studentId)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(student.studentId)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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
            vertical: 'bottom',
            horizontal: 'center',
          }}
        />
      </DashboardCard>

      {/* Add/Edit Student Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>{editStudentId ? 'Edit Student' : 'Add Student'}</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="emailAddress"
            label="Email Address"
            value={formData.emailAddress}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="address"
            label="Address"
            value={formData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="emergencyContactName"
            label="Emergency Contact Name"
            value={formData.emergencyContactName}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="emergencyContactPhoneNumber"
            label="Emergency Contact Phone Number"
            value={formData.emergencyContactPhoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="emergencyContactRelationship"
            label="Emergency Contact Relationship"
            value={formData.emergencyContactRelationship}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="medicalInformation"
            label="Medical Information"
            value={formData.medicalInformation}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="additionalNotes"
            label="Additional Notes"
            value={formData.additionalNotes}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleAddStudent} color="primary">
            {editStudentId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
