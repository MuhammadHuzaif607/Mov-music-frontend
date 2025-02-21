import { useState } from 'react';
import { Modal, TextField, Button } from '@mui/material';
import PropTypes from 'prop-types';
import apiClient from '../utils/apiClient';

const UpdateContributor = ({ fetchContributors, accessToken }) => {
  const [contributorData, setContributorData] = useState({
    id: '',
    name: '',
  });
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  // Handle opening the modal
  const handleOpen = () => {
    setOpen(true);
  };

  // Handle closing the modal
  const handleClose = () => {
    setOpen(false);
    setContributorData({ id: '', name: '' }); // Clear the form when closing
    setError(null); // Clear any error message when closing
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContributorData({ ...contributorData, [name]: value });
  };

  const onUpdateContributor = async () => {
    setError(null);

    try {
      const response = await apiClient.put(
        `/contributors/${contributorData.id}/`,
        {
          name: contributorData.name,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log('Contributor updated successfully:', response.data);
      fetchContributors(); // Refresh the contributor list after updating
      handleClose(); // Close the modal after successful update
    } catch (error) {
      setError('Failed to update contributor.');
      console.log('Error:', error);
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <Button variant="contained" onClick={handleOpen}>
        Update Contributor
      </Button>

      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <div className="modal-content bg-white max-w-md mx-auto p-6 rounded shadow-lg text-center">
          <h2>Update Contributor</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-row">
              <TextField
                label="ID"
                name="id"
                value={contributorData.id}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>
            <div className="input-row">
              <TextField
                label="Name"
                name="name"
                value={contributorData.name}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>

            {error && <div className="text-red-500 my-2">{error}</div>}

            <div className="modal-actions mt-4">
              <Button variant="contained" onClick={onUpdateContributor}>
                Update
              </Button>
              <Button variant="outlined" onClick={handleClose} className="ml-2">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

// Add PropTypes to validate props
UpdateContributor.propTypes = {
  fetchContributors: PropTypes.func.isRequired,
  accessToken: PropTypes.string.isRequired,
};

export default UpdateContributor;
