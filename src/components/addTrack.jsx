import { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import apiClient from '../utils/apiClient';

function AddTrack() {
  const [formData, setFormData] = useState({
    order: '',
    release: '',
    name: '',
    mix_name: '',
    language: '',
    vocals: '',
    artists: [{ order: '', artist: '', kind: 'main' }],
    publishers: [{ order: '', publisher: '', author: '' }],
    contributors: [{ order: '', contributor: '', role: '' }],
    label_share: '',
    genre: '',
    subgenre: '',
    resource: '',
    dolby_atmos_resource: '',
    copyright_holder: '',
    copyright_holder_year: '',
    album_only: false,
    sample_start: '',
    explicit_content: false,
    ISRC: '',
    generate_isrc: false,
    DA_ISRC: '',
    track_length: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle nested array input changes (artists, publishers, contributors)
  const handleNestedArrayChange = (arrayName, index, field, value) => {
    const updatedArray = formData[arrayName].map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData({
      ...formData,
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
      const response = await apiClient.post('/tracks/', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          order: '',
          release: '',
          name: '',
          mix_name: '',
          language: '',
          vocals: '',
          artists: [{ order: '', artist: '', kind: 'main' }],
          publishers: [{ order: '', publisher: '', author: '' }],
          contributors: [{ order: '', contributor: '', role: '' }],
          label_share: '',
          genre: '',
          subgenre: '',
          resource: '',
          dolby_atmos_resource: '',
          copyright_holder: '',
          copyright_holder_year: '',
          album_only: false,
          sample_start: '',
          explicit_content: false,
          ISRC: '',
          generate_isrc: false,
          DA_ISRC: '',
          track_length: '',
        });
      }
    } catch (err) {
      setError('Failed to submit the form. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Add Track
      </Typography>

      {/* Error handling */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Success message */}
      {success && (
        <Alert severity="success" style={{ marginBottom: '20px' }}>
          Track added successfully!
        </Alert>
      )}

      {/* Form */}
      <Paper style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
        <form onSubmit={handleSubmit}>
          {/* Basic Fields */}
          <TextField
            fullWidth
            label="Order"
            name="order"
            type="number"
            value={formData.order}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Release ID"
            name="release"
            type="number"
            value={formData.release}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Track Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Mix Name"
            name="mix_name"
            value={formData.mix_name}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Vocals"
            name="vocals"
            value={formData.vocals}
            onChange={handleInputChange}
            margin="normal"
          />

          {/* Artists */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Artists
          </Typography>
          {formData.artists.map((artist, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <TextField
                label="Artist Order"
                type="number"
                value={artist.order}
                onChange={(e) =>
                  handleNestedArrayChange(
                    'artists',
                    index,
                    'order',
                    e.target.value
                  )
                }
                margin="normal"
              />
              <TextField
                label="Artist ID"
                type="number"
                value={artist.artist}
                onChange={(e) =>
                  handleNestedArrayChange(
                    'artists',
                    index,
                    'artist',
                    e.target.value
                  )
                }
                margin="normal"
              />
              <TextField
                label="Artist Kind"
                value={artist.kind}
                onChange={(e) =>
                  handleNestedArrayChange(
                    'artists',
                    index,
                    'kind',
                    e.target.value
                  )
                }
                margin="normal"
              />
            </div>
          ))}

          {/* Publishers */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Publishers
          </Typography>
          {formData.publishers.map((publisher, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <TextField
                label="Publisher Order"
                type="number"
                value={publisher.order}
                onChange={(e) =>
                  handleNestedArrayChange(
                    'publishers',
                    index,
                    'order',
                    e.target.value
                  )
                }
                margin="normal"
              />
              <TextField
                label="Publisher ID"
                type="number"
                value={publisher.publisher}
                onChange={(e) =>
                  handleNestedArrayChange(
                    'publishers',
                    index,
                    'publisher',
                    e.target.value
                  )
                }
                margin="normal"
              />
              <TextField
                label="Author"
                value={publisher.author}
                onChange={(e) =>
                  handleNestedArrayChange(
                    'publishers',
                    index,
                    'author',
                    e.target.value
                  )
                }
                margin="normal"
              />
            </div>
          ))}

          {/* Contributors */}
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Contributors
          </Typography>
          {formData.contributors.map((contributor, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <TextField
                label="Contributor Order"
                type="number"
                value={contributor.order}
                onChange={(e) =>
                  handleNestedArrayChange(
                    'contributors',
                    index,
                    'order',
                    e.target.value
                  )
                }
                margin="normal"
              />
              <TextField
                label="Contributor ID"
                type="number"
                value={contributor.contributor}
                onChange={(e) =>
                  handleNestedArrayChange(
                    'contributors',
                    index,
                    'contributor',
                    e.target.value
                  )
                }
                margin="normal"
              />
              <TextField
                label="Role"
                type="number"
                value={contributor.role}
                onChange={(e) =>
                  handleNestedArrayChange(
                    'contributors',
                    index,
                    'role',
                    e.target.value
                  )
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
            value={formData.label_share}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Genre ID"
            name="genre"
            type="number"
            value={formData.genre}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Subgenre ID"
            name="subgenre"
            type="number"
            value={formData.subgenre}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Resource"
            name="resource"
            value={formData.resource}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Dolby Atmos Resource"
            name="dolby_atmos_resource"
            value={formData.dolby_atmos_resource}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Copyright Holder"
            name="copyright_holder"
            value={formData.copyright_holder}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Copyright Holder Year"
            name="copyright_holder_year"
            value={formData.copyright_holder_year}
            onChange={handleInputChange}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="album_only"
                checked={formData.album_only}
                onChange={handleInputChange}
              />
            }
            label="Album Only"
          />
          <TextField
            fullWidth
            label="Sample Start"
            name="sample_start"
            value={formData.sample_start}
            onChange={handleInputChange}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="explicit_content"
                checked={formData.explicit_content}
                onChange={handleInputChange}
              />
            }
            label="Explicit Content"
          />
          <TextField
            fullWidth
            label="ISRC"
            name="ISRC"
            value={formData.ISRC}
            onChange={handleInputChange}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Checkbox
                name="generate_isrc"
                checked={formData.generate_isrc}
                onChange={handleInputChange}
              />
            }
            label="Generate ISRC"
          />
          <TextField
            fullWidth
            label="DA ISRC"
            name="DA_ISRC"
            value={formData.DA_ISRC}
            onChange={handleInputChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Track Length"
            name="track_length"
            value={formData.track_length}
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
            {loading ? <CircularProgress size={24} /> : 'Add Track'}
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default AddTrack;
