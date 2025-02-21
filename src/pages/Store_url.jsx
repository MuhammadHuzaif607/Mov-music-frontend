import { useEffect, useState } from 'react';
import {
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import apiClient from '../utils/apiClient';

function StoreUrls() {
  const [storeUrls, setStoreUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const accessToken = localStorage.getItem('accessToken');

  // Fetch store URLs data
  const fetchStoreUrls = async (page = 1, pageSize = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/store-urls/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: page,
          page_size: pageSize,
        },
      });
      setStoreUrls(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError('Failed to fetch store URLs.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch store URLs on component mount
  useEffect(() => {
    fetchStoreUrls();
  }, []);

  // Handle pagination
  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage(currentPage + 1);
      fetchStoreUrls(currentPage + 1, 5);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchStoreUrls(currentPage - 1, 5);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Store URLs</h2>

      {/* Error handling */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Loading state */}
      {loading && <CircularProgress />}

      {/* Store URLs Table */}
      {!loading && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>URL</TableCell>
                <TableCell>Release ID</TableCell>
                <TableCell>Store Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {storeUrls.length > 0 ? (
                storeUrls.map((storeUrl, index) => (
                  <TableRow key={index}>
                    <TableCell>{storeUrl.url}</TableCell>
                    <TableCell>{storeUrl.release}</TableCell>
                    <TableCell>{storeUrl.store_name}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No store URLs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pagination Controls */}
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={!pagination.previous}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={!pagination.next}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default StoreUrls;