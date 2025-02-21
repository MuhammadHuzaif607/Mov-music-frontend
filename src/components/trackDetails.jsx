import { useState } from 'react';
import {
  CircularProgress,
  Alert,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from '@mui/material';
import apiClient from '../utils/apiClient';

function TrackDetails() {
  const [trackId, setTrackId] = useState(''); // Track ID entered by the user
  const [track, setTrack] = useState(null); // Track details fetched from the API
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

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
      setError(err.response.data.detail);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTrack();
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Track Details
      </Typography>

      {/* Form for entering track ID */}
      <Paper style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <form onSubmit={handleSubmit}>
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
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Fetch Track Details'}
          </Button>
        </form>
      </Paper>

      {/* Error handling */}
      {error && (
        <Alert severity="error" style={{ marginTop: '20px' }}>
          {error}
        </Alert>
      )}

      {/* Display track details */}
      {track && (
        <Paper
          style={{
            padding: '20px',
            marginTop: '20px',
            maxWidth: '800px',
            margin: 'auto',
          }}
        >
          <Typography variant="h6">Basic Information</Typography>
          <List>
            <ListItem>
              <ListItemText primary="ID" secondary={track.id} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Order" secondary={track.order} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Name" secondary={track.name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Mix Name" secondary={track.mix_name} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Language" secondary={track.language} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Vocals" secondary={track.vocals} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Label Share"
                secondary={track.label_share}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Genre" secondary={track.genre} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Subgenre" secondary={track.subgenre} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Resource" secondary={track.resource} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Copyright Holder"
                secondary={track.copyright_holder}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Copyright Holder Year"
                secondary={track.copyright_holder_year}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Album Only"
                secondary={track.album_only ? 'Yes' : 'No'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Sample Start"
                secondary={track.sample_start}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Explicit Content"
                secondary={track.explicit_content ? 'Yes' : 'No'}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="ISRC" secondary={track.ISRC} />
            </ListItem>
            <ListItem>
              <ListItemText primary="DA ISRC" secondary={track.DA_ISRC} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Generate ISRC"
                secondary={track.generate_isrc ? 'Yes' : 'No'}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Track Length"
                secondary={track.track_lenght}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Track Data Complete"
                secondary={track.track_data_complete ? 'Yes' : 'No'}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="QC Passed" secondary={track.qc_passed} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="QC Feedback"
                secondary={track.qc_feedback}
              />
            </ListItem>
          </List>

          {/* Artists */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Artists
          </Typography>
          <List>
            {track.artists.map((artist) => (
              <ListItem key={artist.id}>
                <ListItemText
                  primary={`${artist.artist.name} (${artist.kind})`}
                  secondary={`Order: ${artist.order}`}
                />
              </ListItem>
            ))}
          </List>

          {/* Publishers */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Publishers
          </Typography>
          <List>
            {track.publishers.map((publisher) => (
              <ListItem key={publisher.id}>
                <ListItemText
                  primary={`${publisher.publisher.name}`}
                  secondary={`Order: ${publisher.order}, Author: ${publisher.author}`}
                />
              </ListItem>
            ))}
          </List>

          {/* Contributors */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Contributors
          </Typography>
          <List>
            {track.contributors.map((contributor) => (
              <ListItem key={contributor.id}>
                <ListItemText
                  primary={`${contributor.contributor.name}`}
                  secondary={`Order: ${contributor.order}, Role: ${contributor.role.name}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </div>
  );
}

export default TrackDetails;
