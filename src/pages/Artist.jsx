import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
  Grid,
  CardMedia,
} from '@mui/material';
import UpdateArtistModal from '../components/ArtistUpdateModal';
import AddArtistModal from '../components/AddArtistModal';
import apiClient from '../utils/apiClient';

function Artist() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [artistData, setArtistData] = useState(null);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const accessToken = localStorage.getItem('accessToken');

  // Fetch all artists
  const fetchArtists = async (page = 1, pageSize = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/artists/', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: page, // Pass the page number
          page_size: pageSize, // Pass the page size
        },
      });
      setArtists(response.data.results);
      setPaginationData({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError('Failed to fetch artists.');
      console.log('Error: ', err);
    } finally {
      setLoading(false);
    }
  };

  // Search artist by ID
  const searchArtistById = async () => {
    setArtistData(null);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/artists/${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setArtistData(response.data);
      console.log(artistData);
    } catch (err) {
      setError(`Error fetching artist with ID: ${searchId}`);
      console.log('Error , ', err.response.data.code);
    }
  };

  useEffect(() => {
    fetchArtists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextPage = () => {
    if (paginationData.next) {
      setCurrentPage(currentPage + 1);
      fetchArtists(currentPage + 1, 5); // Fetch the next page
    }
  };

  const handlePreviousPage = () => {
    if (paginationData.previous && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchArtists(currentPage - 1, 5); // Fetch the previous page
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Artists</h2>
      {/* Search artist by ID */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Search Artist by ID"
          variant="outlined"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <Button
          variant="contained"
          style={{ marginLeft: '10px' }}
          onClick={searchArtistById}
        >
          Search
        </Button>
      </div>
      {/* Error handling */}
      {error && <Alert severity="error">{error}</Alert>}
      {/* Display artist data when searched by ID */}
      {artistData && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Artist Details</h3>
          <Grid container spacing={3}>
            {artistData ? (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card>
                  {artistData.image_small && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={artistData.image_small}
                      alt={`${artistData.name}'s image`}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6">
                      {artistData.name || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email: {artistData.email || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Spotify Identifier:{' '}
                      {artistData.spotify_identifier || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Deezer Details:{' '}
                      {artistData.deezer_details &&
                      artistData.deezer_details.error
                        ? artistData.deezer_details.error.message
                        : 'No details'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Amazon Music Details:{' '}
                      {artistData.amazon_music_details &&
                      artistData.amazon_music_details.data.artist
                        ? artistData.amazon_music_details.data.artist
                        : 'No details'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Popularity:{' '}
                      {artistData.popularity !== null
                        ? artistData.popularity
                        : 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Followers:{' '}
                      {artistData.followers !== null
                        ? artistData.followers
                        : 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              <Typography variant="h6" color="textSecondary">
                No artist data available
              </Typography>
            )}
          </Grid>
        </div>
      )}
      <div className="flex gap-x-4">
        <UpdateArtistModal />
        <AddArtistModal />
      </div>

      {/* Loading state */}
      {loading && <CircularProgress />}

      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Amazon Music Identifier</th>
            <th className="py-2 px-4 border-b">Apple Identifier</th>
            <th className="py-2 px-4 border-b">Deezer Identifier</th>
            <th className="py-2 px-4 border-b">Spotify Identifier</th>
            <th className="py-2 px-4 border-b">Email</th>
          </tr>
        </thead>
        <tbody>
          {artists.map((artist) => (
            <tr key={artist.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{artist.id}</td>
              <td className="py-2 px-4 border-b">{artist.name}</td>
              <td className="py-2 px-4 border-b">
                {artist.amazon_music_identifier}
              </td>
              <td className="py-2 px-4 border-b">{artist.apple_identifier}</td>
              <td className="py-2 px-4 border-b">{artist.deezer_identifier}</td>
              <td className="py-2 px-4 border-b">
                {artist.spotify_identifier}
              </td>
              <td className="py-2 px-4 border-b">{artist.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePreviousPage}
          disabled={!paginationData.previous}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${
            !paginationData.previous ? 'cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>

        <button
          onClick={handleNextPage}
          disabled={!paginationData.next}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            !paginationData.next ? 'cursor-not-allowed' : ''
          }`}
        >
          Next
        </button>
      </div>
      {/* Error when fetching artists */}
      {!loading &&
        (!Array.isArray(artists) || artists.length === 0) &&
        !error && <Alert severity="info">No artists found.</Alert>}
    </div>
  );
}

export default Artist;
