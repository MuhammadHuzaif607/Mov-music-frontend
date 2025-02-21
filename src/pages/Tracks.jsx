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
import AddTrack from '../components/addTrack';
import TrackDetails from '../components/trackDetails';
import UpdateTrack from '../components/updateTrack';

function Tracks() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const accessToken = localStorage.getItem('accessToken');

  // Fetch tracks data
  const fetchTracks = async (page = 1, pageSize = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/tracks/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: page,
          page_size: pageSize,
        },
      });
      setTracks(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError('Failed to fetch tracks.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tracks on component mount
  useEffect(() => {
    fetchTracks();
  }, []);

  // Handle pagination
  const handleNextPage = () => {
    if (pagination.next) {
      setCurrentPage(currentPage + 1);
      fetchTracks(currentPage + 1, 5);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.previous && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchTracks(currentPage - 1, 5);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Tracks</h2>

      <AddTrack/>
      <TrackDetails/>
      <UpdateTrack/>

      {/* Error handling */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Loading state */}
      {loading && <CircularProgress />}

      {/* Tracks Table */}
      {!loading && (
        <TableContainer component={Paper} style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Mix Name</TableCell>
                <TableCell>Language</TableCell>
                <TableCell>Vocals</TableCell>
                <TableCell>ISRC</TableCell>
                <TableCell>Explicit Content</TableCell>
                <TableCell>QC Passed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tracks.length > 0 ? (
                tracks.map((track) => (
                  <TableRow key={track.id}>
                    <TableCell>{track.id}</TableCell>
                    <TableCell>{track.name}</TableCell>
                    <TableCell>{track.mix_name}</TableCell>
                    <TableCell>{track.language}</TableCell>
                    <TableCell>{track.vocals}</TableCell>
                    <TableCell>{track.ISRC}</TableCell>
                    <TableCell>
                      {track.explicit_content ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell>{track.qc_passed}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No tracks found.
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

export default Tracks;
