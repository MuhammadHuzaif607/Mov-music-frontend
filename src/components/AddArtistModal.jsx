import { useState } from 'react';
import { Modal, TextField, Button } from '@mui/material';
import apiClient  from '../utils/apiClient';

const AddArtistModal = () => {
  const [open, setOpen] = useState(false); // Manage modal open/close state
  const [artistData, setArtistData] = useState({
    name: '',
    amazon_music_identifier: '',
    apple_identifier: '',
    deezer_identifier: '',
    spotify_identifier: '',
    email: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtistData({ ...artistData, [name]: value });
  };

  const handleAddArtist = async () => {
    try {
      const response = await apiClient.post('/artists/', artistData);
      console.log('Artist added:', response.data);
      handleClose(); // Close modal after successful addition
    } catch (error) {
      console.error('Error adding artist:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Button to open modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add New Artist
      </Button>

      {/* Modal to add new artist */}
      <Modal open={open} onClose={handleClose}>
        <div className="modal-content bg-white p-4 rounded-lg max-w-lg mx-auto mt-10">
          <h2 className="text-xl mb-4">Add New Artist</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-row flex gap-4">
              <TextField
                label="Name"
                name="name"
                value={artistData.name}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <TextField
                label="Amazon Music Identifier"
                name="amazon_music_identifier"
                value={artistData.amazon_music_identifier}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>
            <div className="input-row flex gap-4 mt-4">
              <TextField
                label="Apple Identifier"
                name="apple_identifier"
                value={artistData.apple_identifier}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Deezer Identifier"
                name="deezer_identifier"
                value={artistData.deezer_identifier}
                onChange={handleInputChange}
                fullWidth
              />
            </div>
            <div className="input-row flex gap-4 mt-4">
              <TextField
                label="Spotify Identifier"
                name="spotify_identifier"
                value={artistData.spotify_identifier}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Email"
                name="email"
                value={artistData.email}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>
            <div className="modal-actions mt-6 flex justify-between">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddArtist}
              >
                Add Artist
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddArtistModal;
