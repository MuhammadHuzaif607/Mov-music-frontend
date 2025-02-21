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
  Typography,
} from '@mui/material';
import apiClient from '../utils/apiClient';

function Trends() {
  const [data, setData] = useState({
    country_wise_sales: { sales: [], max: 0 },
    top_10_tracks: [],
    multi_sales_graph_data: {
      labels: [],
      combined_sales: { data: [] },
      store_sales: {},
    },
    gender_graph_data: { labels: [], data: [] },
    age_graph_data: { labels: [], data: {} },
    stores: [],
    labels: [],
    releases: [],
    tracks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('accessToken');

  // Fetch trends data
  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/trends/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('API Response:', response.data); // Log the response
      setData(response.data); // Set the entire response data
    } catch (err) {
      setError('Failed to fetch trends.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trends on component mount
  useEffect(() => {
    fetchTrends();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Trends</h2>

      {/* Error handling */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Loading state */}
      {loading && <CircularProgress />}

      {/* Display Data */}
      {!loading && (
        <div>
          {/* Country-wise Sales */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Country-wise Sales
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: '10px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  <TableCell>Sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.country_wise_sales.sales.length > 0 ? (
                  data.country_wise_sales.sales.map((sale, index) => (
                    <TableRow key={index}>
                      <TableCell>{sale.country}</TableCell>
                      <TableCell>{sale.sales}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No country-wise sales data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Top 10 Tracks */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Top 10 Tracks
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: '10px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Track Name</TableCell>
                  <TableCell>Sales</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.top_10_tracks.length > 0 ? (
                  data.top_10_tracks.map((track, index) => (
                    <TableRow key={index}>
                      <TableCell>{track.name}</TableCell>
                      <TableCell>{track.sales}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No top tracks data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Stores */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Stores
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: '10px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Store Name</TableCell>
                  <TableCell>ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.stores.length > 0 ? (
                  data.stores.map((store, index) => (
                    <TableRow key={index}>
                      <TableCell>{store.name}</TableCell>
                      <TableCell>{store.id}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No stores data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Labels */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Labels
          </Typography>
          <TableContainer component={Paper} style={{ marginTop: '10px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Label Name</TableCell>
                  <TableCell>ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.labels.length > 0 ? (
                  data.labels.map((label, index) => (
                    <TableRow key={index}>
                      <TableCell>{label.name}</TableCell>
                      <TableCell>{label.id}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No labels data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </div>
  );
}

export default Trends;
