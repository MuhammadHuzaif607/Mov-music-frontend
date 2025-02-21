import { useState } from 'react';
import { Modal, Button, TextField } from '@mui/material';
import apiClient from '../utils/apiClient'; // Import your apiClient

const UpdateArtistModal = () => {
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [artistData, setArtistData] = useState({
    id: '', // ID to update artist
    name: '',
    amazon_music_identifier: '',
    apple_identifier: '',
    deezer_identifier: '',
    spotify_identifier: '',
    email: '',
  });

  // Function to handle the update API call using apiClient
  const onUpdateArtist = async () => {
    try {
      const response = await apiClient.put(`/artists/${artistData.id}/`, {
        name: artistData.name,
        amazon_music_identifier: artistData.amazon_music_identifier,
        apple_identifier: artistData.apple_identifier,
        deezer_identifier: artistData.deezer_identifier,
        spotify_identifier: artistData.spotify_identifier,
        email: artistData.email,
      });

      if (response.status === 200) {
        const updatedArtist = response.data;
        console.log('Artist updated successfully:', updatedArtist);
        handleClose(); // Close the modal on successful update

        setArtistData({
          id: '', // ID to update artist
          name: '',
          amazon_music_identifier: '',
          apple_identifier: '',
          deezer_identifier: '',
          spotify_identifier: '',
          email: '',
        });
      } else {
        console.error('Error updating artist:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating artist:', error);
    }
  };

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtistData({ ...artistData, [name]: value });
  };

  // Open the modal
  const handleOpen = () => setOpen(true);

  // Close the modal
  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Button to open the modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Update Artist
      </Button>

      {/* Modal Component */}
      <Modal open={open} onClose={handleClose}>
        <div className="bg-white rounded-lg max-w-md mx-auto my-20 p-6 relative">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Update Artist
          </h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4">
              <TextField
                label="ID"
                name="id"
                value={artistData.id}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={onUpdateArtist}>
                Update
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UpdateArtistModal;
