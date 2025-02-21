import { useState, useEffect } from 'react';
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
} from '@mui/material';
import DeliveryConfirmationById from '../components/deliveryConfirmationById';

const Delivery_Confirmation = () => {
  const [confirmations, setConfirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  const fetchDeliveryConfirmations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/ddex-delivery-confirmations/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setConfirmations(response.data.results);
    } catch (err) {
      setError('Failed to fetch delivery confirmations.');
      console.error('Error fetching delivery confirmations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryConfirmations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" className="text-center">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <DeliveryConfirmationById/>
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
            {confirmations.length > 0 ? (
              confirmations.map((confirmation) => (
                <TableRow key={confirmation.id}>
                  <TableCell>{confirmation.id}</TableCell>
                  <TableCell>{confirmation.status}</TableCell>
                  <TableCell>{confirmation.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No delivery confirmations available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Delivery_Confirmation;
