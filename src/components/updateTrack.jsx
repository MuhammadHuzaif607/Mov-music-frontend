import { useState } from 'react';
import {
  CircularProgress,
  Alert,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import apiClient from '../utils/apiClient';

function UpdateTrack() {
  const [trackId, setTrackId] = useState(''); // Track ID entered by the user
  const [track, setTrack] = useState(null); // Track details fetched from the API
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [success, setSuccess] = useState(false); // Success state

  const accessToken = localStorage.getItem('accessToken');

  // Fetch track data by ID
  const fetchTrack = async () => {
    if (!trackId) {
      setError('Please enter a valid track ID.');
      return;
    }

    setLoading(true);
    setError(null);
    setTrack(null); // Reset track details

    try {
      const response = await apiClient.get(`/tracks/${trackId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTrack(response.data);
    } catch (err) {
      setError('Failed to fetch track details. Please check the track ID.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTrack({
      ...track,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle nested array input changes (artists, publishers, contributors)
  const handleNestedArrayChange = (arrayName, index, field, value) => {
    const updatedArray = track[arrayName].map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setTrack({
      ...track,
      [arrayName]: updatedArray,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiClient.put(`/tracks/${trackId}/`, track, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      setError('Failed to update track. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Update Track
      </Typography>

      {/* Error handling */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Success message */}
      {success && (
        <Alert severity="success" style={{ marginBottom: '20px' }}>
          Track updated successfully!
        </Alert>
      )}

      {/* Form for entering track ID */}
      <Paper style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            fullWidth
            label="Enter Track ID"
            variant="outlined"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            required
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchTrack}
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch Track Details'}
          </Button>
        </form>
      </Paper>

      {/* Display track details for editing */}
      {track && (
        <Paper style={{ padding: '20px', marginTop: '20px', maxWidth: '800px', margin: 'auto' }}>
          <form onSubmit={handleSubmit}>
            {/* Basic Fields */}
            <TextField
              fullWidth
              label="Order"
              name="order"
              type="number"
              value={track.order}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Release ID"
              name="release"
              type="number"
              value={track.release}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={track.name}
              onChange={handleInputChange}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Mix Name"
              name="mix_name"
              value={track.mix_name}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Language"
              name="language"
              value={track.language}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Vocals"
              name="vocals"
              value={track.vocals}
              onChange={handleInputChange}
              margin="normal"
            />

            {/* Artists */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              Artists
            </Typography>
            {track.artists.map((artist, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <TextField
                  label="Artist Order"
                  type="number"
                  value={artist.order}
                  onChange={(e) =>
                    handleNestedArrayChange('artists', index, 'order', e.target.value)
                  }
                  margin="normal"
                />
                <TextField
                  label="Artist ID"
                  type="number"
                  value={artist.artist}
                  onChange={(e) =>
                    handleNestedArrayChange('artists', index, 'artist', e.target.value)
                  }
                  margin="normal"
                />
                <TextField
                  label="Artist Kind"
                  value={artist.kind}
                  onChange={(e) =>
                    handleNestedArrayChange('artists', index, 'kind', e.target.value)
                  }
                  margin="normal"
                />
              </div>
            ))}

            {/* Publishers */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              Publishers
            </Typography>
            {track.publishers.map((publisher, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <TextField
                  label="Publisher Order"
                  type="number"
                  value={publisher.order}
                  onChange={(e) =>
                    handleNestedArrayChange('publishers', index, 'order', e.target.value)
                  }
                  margin="normal"
                />
                <TextField
                  label="Publisher ID"
                  type="number"
                  value={publisher.publisher}
                  onChange={(e) =>
                    handleNestedArrayChange('publishers', index, 'publisher', e.target.value)
                  }
                  margin="normal"
                />
                <TextField
                  label="Author"
                  value={publisher.author}
                  onChange={(e) =>
                    handleNestedArrayChange('publishers', index, 'author', e.target.value)
                  }
                  margin="normal"
                />
              </div>
            ))}

            {/* Contributors */}
            <Typography variant="h6" style={{ marginTop: '20px' }}>
              Contributors
            </Typography>
            {track.contributors.map((contributor, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <TextField
                  label="Contributor Order"
                  type="number"
                  value={contributor.order}
                  onChange={(e) =>
                    handleNestedArrayChange('contributors', index, 'order', e.target.value)
                  }
                  margin="normal"
                />
                <TextField
                  label="Contributor ID"
                  type="number"
                  value={contributor.contributor}
                  onChange={(e) =>
                    handleNestedArrayChange('contributors', index, 'contributor', e.target.value)
                  }
                  margin="normal"
                />
                <TextField
                  label="Role"
                  type="number"
                  value={contributor.role}
                  onChange={(e) =>
                    handleNestedArrayChange('contributors', index, 'role', e.target.value)
                  }
                  margin="normal"
                />
              </div>
            ))}

            {/* Additional Fields */}
            <TextField
              fullWidth
              label="Label Share"
              name="label_share"
              value={track.label_share}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Genre ID"
              name="genre"
              type="number"
              value={track.genre}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Subgenre ID"
              name="subgenre"
              type="number"
              value={track.subgenre}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Resource"
              name="resource"
              value={track.resource}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Dolby Atmos Resource"
              name="dolby_atmos_resource"
              value={track.dolby_atmos_resource}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Copyright Holder"
              name="copyright_holder"
              value={track.copyright_holder}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Copyright Holder Year"
              name="copyright_holder_year"
              value={track.copyright_holder_year}
              onChange={handleInputChange}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="album_only"
                  checked={track.album_only}
                  onChange={handleInputChange}
                />
              }
              label="Album Only"
            />
            <TextField
              fullWidth
              label="Sample Start"
              name="sample_start"
              value={track.sample_start}
              onChange={handleInputChange}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="explicit_content"
                  checked={track.explicit_content}
                  onChange={handleInputChange}
                />
              }
              label="Explicit Content"
            />
            <TextField
              fullWidth
              label="ISRC"
              name="ISRC"
              value={track.ISRC}
              onChange={handleInputChange}
              margin="normal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="generate_isrc"
                  checked={track.generate_isrc}
                  onChange={handleInputChange}
                />
              }
              label="Generate ISRC"
            />
            <TextField
              fullWidth
              label="DA ISRC"
              name="DA_ISRC"
              value={track.DA_ISRC}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Track Length"
              name="track_lenght"
              value={track.track_lenght}
              onChange={handleInputChange}
              margin="normal"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              style={{ marginTop: '20px' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Track'}
            </Button>
          </form>
        </Paper>
      )}
    </div>
  );
}

export default UpdateTrack;