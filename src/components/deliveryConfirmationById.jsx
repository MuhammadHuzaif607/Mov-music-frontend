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

const DeliveryConfirmationById = () => {
  const [confirmation, setConfirmation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmationId, setConfirmationId] = useState('');
  const accessToken = localStorage.getItem('accessToken');

  const fetchDeliveryConfirmationById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(
        `/ddex-delivery-confirmations/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data)
      setConfirmation(response.data);
    } catch (err) {
      setError('Failed to fetch delivery confirmation.');
      console.error('Error fetching delivery confirmation:', err.response.data.detail);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    if (confirmationId) {
      fetchDeliveryConfirmationById(confirmationId);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <TextField
          label="Delivery Confirmation ID"
          variant="outlined"
          value={confirmationId}
          onChange={(e) => setConfirmationId(e.target.value)}
        />
        <Button
          onClick={handleFetch}
          variant="contained"
          color="primary"
          className="ml-4"
        >
          Get Confirmation
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
      ) : confirmation ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>{confirmation.id}</TableCell>
                <TableCell>{confirmation.status}</TableCell>
                <TableCell>{confirmation.date}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography className="text-center">
          Enter an ID to get confirmation details
        </Typography>
      )}
    </div>
  );
};

export default DeliveryConfirmationById;
