import { useState } from 'react';
import apiClient from '../utils/apiClient';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  Button,
} from '@mui/material';

const UserById = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState('');
  const accessToken = localStorage.getItem('accessToken');

  const fetchUserById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/users/${id}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data);
      setUser(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch user.');
      console.error('Error fetching user:', err.response?.data?.detail);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    if (userId.trim()) {
      fetchUserById(userId); // Make sure the current `userId` is passed here.
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <TextField
          label="User ID"
          variant="outlined"
          value={userId} 
          onChange={(e) => {
            setUserId(e.target.value);
            console.log(userId);
          }}
        />
        <Button
          onClick={handleFetch}
          variant="contained"
          color="primary"
          className="ml-4"
        >
          Get User
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : error ? (
        <Typography color="error" className="text-center">
          {error}
        </Typography>
      ) : user ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Country</TableCell>
                <TableCell>Street & Number</TableCell>
                <TableCell>Postal Code</TableCell>
                <TableCell>City</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.company}</TableCell>
                <TableCell>{user.country}</TableCell>
                <TableCell>{user.street_and_number}</TableCell>
                <TableCell>{user.postal_code}</TableCell>
                <TableCell>{user.city}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography className="text-center">Enter an ID to get User</Typography>
      )}
    </div>
  );
};

export default UserById;
