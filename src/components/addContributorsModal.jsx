import { useState } from 'react';
import { Button, Modal, TextField } from '@mui/material';
import apiClient from '../utils/apiClient';
import PropTypes from 'prop-types';

const AddContributor = ({ accessToken, fetchContributors }) => {
  const [open, setOpen] = useState(false);
  const [contributorData, setContributorData] = useState({
    id: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setContributorData({
      id: '',
      name: '',
    });
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContributorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onAddContributor = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post(
        '/contributors',
        {
          id: contributorData.id,
          name: contributorData.name,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data);
      fetchContributors(); // Refetch contributors to show the updated list
      handleClose(); // Close the modal after adding the contributor
    } catch (err) {
      setError('Failed to add contributor.');
      console.log('Error: ', err);
    } finally {
      setLoading(false);
    }
  };

  AddContributor.propTypes = {
    accessToken: PropTypes.string.isRequired,
    fetchContributors: PropTypes.func.isRequired, // Add this line
  };

  return (
    <div className="pb-4">
      {/* Button to open the modal */}
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Add Contributor
      </Button>

      {/* Modal for adding contributor */}
      <Modal open={open} onClose={handleClose}>
        <div className="modal-content bg-white max-w-lg mx-auto p-6 rounded shadow-lg mt-10">
          <h2 className="text-2xl mb-4">Add Contributor</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="input-row mb-4">
              <TextField
                label="ID"
                name="id"
                value={contributorData.id}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>
            <div className="input-row mb-4">
              <TextField
                label="Name"
                name="name"
                value={contributorData.name}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </div>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="modal-actions flex justify-end gap-x-2">
              <Button
                variant="contained"
                color="primary"
                onClick={onAddContributor}
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add'}
              </Button>
              <Button variant="outlined" onClick={handleClose} className="ml-2">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default AddContributor;
