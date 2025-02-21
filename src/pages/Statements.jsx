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

function Statements() {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const accessToken = localStorage.getItem('accessToken');

  // Fetch statements data
  const fetchStatements = async (page = 1, pageSize = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/statements/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: page,
          page_size: pageSize,
        },
      });
      setStatements(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError('Failed to fetch statements.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statements on component mount
  useEffect(() => {
    fetchStatements();
  }, []);

  // Handle pagination
  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage(currentPage + 1);
      fetchStatements(currentPage + 1, 5);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchStatements(currentPage - 1, 5);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Statements</h2>

      {/* Error handling */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Loading state */}
      {loading && <CircularProgress />}

      {/* Statements Table */}
      {!loading && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Kind</TableCell>
                <TableCell>STS Kind</TableCell>
                <TableCell>Quartal</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Year Period</TableCell>
                <TableCell>Issue Month</TableCell>
                <TableCell>Issue Year</TableCell>
                <TableCell>Short Description</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Invoice Generated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {statements.length > 0 ? (
                statements.map((statement) => (
                  <TableRow key={statement.id}>
                    <TableCell>{statement.id}</TableCell>
                    <TableCell>{statement.name}</TableCell>
                    <TableCell>{statement.kind}</TableCell>
                    <TableCell>{statement.sts_kind}</TableCell>
                    <TableCell>{statement.quartal}</TableCell>
                    <TableCell>{statement.month}</TableCell>
                    <TableCell>{statement.year}</TableCell>
                    <TableCell>{statement.year_period}</TableCell>
                    <TableCell>{statement.issue_month}</TableCell>
                    <TableCell>{statement.issue_year}</TableCell>
                    <TableCell>{statement.short_description}</TableCell>
                    <TableCell>{statement.price}</TableCell>
                    <TableCell>{statement.currency}</TableCell>
                    <TableCell>{statement.status}</TableCell>
                    <TableCell>
                      {statement.invoice_generated ? 'Yes' : 'No'}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={14} align="center">
                    No statements found.
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

export default Statements;
