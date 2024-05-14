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
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState(null); // New state to store the ID of the teacher being edited
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    department: '',
    qualification: '',
    additionalNotes: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const teachersPerPage = 6;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('https://sms-1-a8o4.onrender.com/getTeacher');
        setTeachers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setError('Error fetching teachers. Please try again later.');
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeacher = async () => {
    try {
      let response;
      if (editTeacherId === null) {
        // If editTeacherId is null, it means we're adding a new teacher
        response = await axios.post('https://sms-1-a8o4.onrender.com/postTeacher', formData);
        // Add the new teacher to the teachers state
        setTeachers([...teachers, response.data]);
      } else {
        // Otherwise, we're updating an existing teacher
        response = await axios.put(`https://sms-1-a8o4.onrender.com/updateTeacher/${editTeacherId}`, formData);
        // Update the teachers state with the updated teacher information
        setTeachers(teachers.map((teacher) => (teacher.teacherId === editTeacherId ? response.data : teacher)));
      }
      setSnackbarOpen(true); // Show success snackbar
      setIsModalOpen(false); // Close modal
    } catch (error) {
      console.error('Error adding/updating teacher:', error);
      setSnackbarOpen(true); // Show error snackbar
    }
  };
  

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(indexOfFirstTeacher, indexOfLastTeacher);

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

  const handleEdit = (teacherId) => {
    // Find the teacher by ID
    const teacherToEdit = teachers.find((teacher) => teacher.teacherId === teacherId);
    // Set the formData state with the data of the teacher to edit
    setFormData({
      name: teacherToEdit.name,
      phoneNumber: teacherToEdit.phoneNumber,
      emailAddress: teacherToEdit.emailAddress,
      address: teacherToEdit.address,
      department: teacherToEdit.department,
      qualification: teacherToEdit.qualification,
      additionalNotes: teacherToEdit.additionalNotes,
    });
    setEditTeacherId(teacherId); // Set the ID of the teacher being edited
    setIsModalOpen(true); // Open the modal for editing
  };

  const handleDelete = async (teacherId) => {
    try {
      await axios.delete(`https://sms-1-a8o4.onrender.com/deleteTeacher/${teacherId}`);
      // Remove the deleted teacher from the state
      setTeachers(teachers.filter((teacher) => teacher.teacherId !== teacherId));
      setSnackbarOpen(true); // Show success snackbar
    } catch (error) {
      console.error('Error deleting teacher:', error);
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
      <DashboardCard title="Teachers">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <TextField
              variant="outlined"
              placeholder="Search teachers..."
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
            aria-label="add teacher"
            onClick={() => {
              setIsModalOpen(true);
              setFormData({
                ...formData,
                name: '',
                phoneNumber: '',
                emailAddress: '',
                address: '',
                department: '',
                qualification: '',
                additionalNotes: '',
              });
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
              <TableHead>
                <TableRow className={'table-head-bgc'}>
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
                      <b>Phone</b>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      <b>Address</b>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      <b>Department</b>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle1">
                      <b>Action</b>
                    </Typography>
                  </TableCell>{' '}
                  {/* New TableCell for Action */}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentTeachers.map((teacher, index) => (
                  <TableRow key={teacher.teacherId} className={index % 2 !== 0 ? 'odd-row' : ''}>
                    <TableCell>{teacher.teacherId}</TableCell>
                    <TableCell>{teacher.name || '-'}</TableCell>
                    <TableCell>{teacher.emailAddress || '-'}</TableCell>
                    <TableCell>{teacher.phoneNumber || '-'}</TableCell>
                    <TableCell>{teacher.address || '-'}</TableCell>
                    <TableCell>{teacher.department || '-'}</TableCell>
                    <TableCell>
                      {/* Edit Icon */}
                      <IconButton onClick={() => handleEdit(teacher.teacherId)}>
                        <EditIcon color="primary" />
                      </IconButton>
                      {/* Delete Icon */}
                      <IconButton onClick={() => handleDelete(teacher.teacherId)}>
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

      {/* Add Teacher Modal */}
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <DialogTitle>Add/Edit Teacher</DialogTitle>
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
            name="department"
            label="Department"
            value={formData.department}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="qualification"
            label="Qualification"
            value={formData.qualification}
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
          <Button onClick={handleAddTeacher} color="primary">
            {editTeacherId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
