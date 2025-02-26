import { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../utils/apiClient";

function Artist() {
  const [artists, setArtists] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [artistDataSingle, setArtistDataSingle] = useState({
    name: "",
    amazon_music_identifier: "",
    apple_identifier: "",
    deezer_identifier: "",
    spotify_identifier: "",
    email: "",
  });
  const [artistData, setArtistData] = useState(null);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingArtistId, setEditingArtistId] = useState(null); // Track which artist is being edited
  const accessToken = localStorage.getItem("accessToken");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArtistDataSingle({ ...artistDataSingle, [name]: value });
  };

  const handleAddArtist = async () => {
    try {
      const response = await apiClient.post("/artists/", artistDataSingle);
      console.log("Artist added:", response.data);
      setArtists([...artists, response.data]);
      handleClose(); // Close modal after successful addition
    } catch (error) {
      console.error("Error adding artist:", error);
    }
  };

  const handleUpdateArtist = async () => {
    try {
      const response = await apiClient.patch(
        `/artists/${editingArtistId}/`,
        artistDataSingle
      );
      console.log("Artist updated:", response.data);
      // Update the artist in the list
      const updatedArtists = artists.map((artist) =>
        artist.id === editingArtistId ? response.data : artist
      );
      setArtists(updatedArtists);
      handleEditClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating artist:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setArtistDataSingle({
      name: "",
      amazon_music_identifier: "",
      apple_identifier: "",
      deezer_identifier: "",
      spotify_identifier: "",
      email: "",
    });
  };

  const handleEditOpen = (artist) => {
    setEditingArtistId(artist.id);
    setArtistDataSingle({
      name: artist.name,
      amazon_music_identifier: artist.amazon_music_identifier,
      apple_identifier: artist.apple_identifier,
      deezer_identifier: artist.deezer_identifier,
      spotify_identifier: artist.spotify_identifier,
      email: artist.email,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditingArtistId(null);
    setArtistDataSingle({
      name: "",
      amazon_music_identifier: "",
      apple_identifier: "",
      deezer_identifier: "",
      spotify_identifier: "",
      email: "",
    });
  };

  // Fetch all artists
  const fetchArtists = async (page = 1, pageSize = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/artists/", {
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
      setError("Failed to fetch artists.");
      console.log("Error: ", err);
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
      console.log("Error , ", err.response.data.code);
    }
  };

  useEffect(() => {
    fetchArtists();
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
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Artists</h2>

      {/* Search artist by ID */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Artist by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={searchArtistById}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Error handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Display artist data when searched by ID */}
      {artistData && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Artist Details</h3>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center space-x-4">
              {artistData.image_small && (
                <img
                  src={artistData.image_small}
                  alt={`${artistData.name}'s image`}
                  className="w-24 h-24 rounded-full"
                />
              )}
              <div>
                <h4 className="text-lg font-bold">{artistData.name || "N/A"}</h4>
                <p className="text-sm text-gray-600">
                  Email: {artistData.email || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Spotify Identifier: {artistData.spotify_identifier || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Deezer Details:{" "}
                  {artistData.deezer_details && artistData.deezer_details.error
                    ? artistData.deezer_details.error.message
                    : "No details"}
                </p>
                <p className="text-sm text-gray-600">
                  Amazon Music Details:{" "}
                  {artistData.amazon_music_details &&
                  artistData.amazon_music_details.data.artist
                    ? artistData.amazon_music_details.data.artist.name
                    : "No details"}
                </p>
                <p className="text-sm text-gray-600">
                  Popularity:{" "}
                  {artistData.popularity !== null ? artistData.popularity : "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Followers:{" "}
                  {artistData.followers !== null ? artistData.followers : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Artist Button */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleOpen}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Artist
        </button>
      </div>

      {/* Modal to add new artist */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Artist</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={artistDataSingle.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Amazon Music Identifier"
                  name="amazon_music_identifier"
                  value={artistDataSingle.amazon_music_identifier}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Apple Identifier"
                  name="apple_identifier"
                  value={artistDataSingle.apple_identifier}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Deezer Identifier"
                  name="deezer_identifier"
                  value={artistDataSingle.deezer_identifier}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Spotify Identifier"
                  name="spotify_identifier"
                  value={artistDataSingle.spotify_identifier}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={artistDataSingle.email}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleAddArtist}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Artist
                </button>
                <button
                  onClick={handleClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal to edit artist */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Artist</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={artistDataSingle.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Amazon Music Identifier"
                  name="amazon_music_identifier"
                  value={artistDataSingle.amazon_music_identifier}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Apple Identifier"
                  name="apple_identifier"
                  value={artistDataSingle.apple_identifier}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Deezer Identifier"
                  name="deezer_identifier"
                  value={artistDataSingle.deezer_identifier}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Spotify Identifier"
                  name="spotify_identifier"
                  value={artistDataSingle.spotify_identifier}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={artistDataSingle.email}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleUpdateArtist}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update Artist
                </button>
                <button
                  onClick={handleEditClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Artists Table */}
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
            <th className="py-2 px-4 border-b">Actions</th>
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
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditOpen(artist)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={handlePreviousPage}
          disabled={!paginationData.previous}
          className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${
            !paginationData.previous ? "cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={!paginationData.next}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            !paginationData.next ? "cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>

      {/* No artists found */}
      {!loading && artists.length === 0 && !error && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mt-4">
          No artists found.
        </div>
      )}
    </div>
  );
}

export default Artist;