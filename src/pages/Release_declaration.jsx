import { useState } from 'react';
import {
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Typography,
} from '@mui/material';
import apiClient from '../utils/apiClient';

function ReleaseUserDeclaration() {
  const [formData, setFormData] = useState({
    release: '',
    user_declaration: '',
    release_license: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const accessToken = localStorage.getItem('accessToken');

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await apiClient.post(
        '/release-user-declaration/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          release: '',
          user_declaration: '',
          release_license: '',
        });
      }
    } catch (err) {
      setError(err.response.data.detail);
      console.error('Error:', err.response.data.detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Release User Declaration
      </Typography>

      {/* Error handling */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Success message */}
      {success && (
        <Alert severity="success" style={{ marginBottom: '20px' }}>
          Form submitted successfully!
        </Alert>
      )}

      {/* Form */}
      <Paper style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
        <form onSubmit={handleSubmit}>
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
            label="User Declaration ID"
            name="user_declaration"
            type="number"
            value={formData.user_declaration}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Release License"
            name="release_license"
            value={formData.release_license}
            onChange={handleInputChange}
            required
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </form>
      </Paper>
    </div>
  );
}

export default ReleaseUserDeclaration;
