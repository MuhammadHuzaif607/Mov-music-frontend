import { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../utils/apiClient";

function Contributors() {
  const [contributors, setContributors] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [contributorDataSingle, setContributorDataSingle] = useState({
    name: "",
  });
  const [contributorData, setContributorData] = useState(null);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingContributorId, setEditingContributorId] = useState(null); // Track which contributor is being edited
  const accessToken = localStorage.getItem("accessToken");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContributorDataSingle({ ...contributorDataSingle, [name]: value });
  };

  const handleAddContributor = async () => {
    try {
      const response = await apiClient.post("/contributors/", contributorDataSingle);
      console.log("Contributor added:", response.data);
      setContributors([...contributors, response.data]);
      handleClose(); // Close modal after successful addition
    } catch (error) {
      console.error("Error adding contributor:", error);
    }
  };

  const handleUpdateContributor = async () => {
    try {
      const response = await apiClient.patch(
        `/contributors/${editingContributorId}/`,
        contributorDataSingle
      );
      console.log("Contributor updated:", response.data);
      // Update the contributor in the list
      const updatedContributors = contributors.map((contributor) =>
        contributor.id === editingContributorId ? response.data : contributor
      );
      setContributors(updatedContributors);
      handleEditClose(); // Close modal after successful update
    } catch (error) {
      console.error("Error updating contributor:", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setContributorDataSingle({
      name: "",
    });
  };

  const handleEditOpen = (contributor) => {
    setEditingContributorId(contributor.id);
    setContributorDataSingle({
      name: contributor.name,
    });
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditingContributorId(null);
    setContributorDataSingle({
      name: "",
    });
  };

  // Fetch all contributors
  const fetchContributors = async (page = 1, pageSize = 5, searchQuery = "") => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/contributors/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: page, // Pass the page number
          page_size: pageSize, // Pass the page size
          search: searchQuery, // Pass the search term
        },
      });
      setContributors(response.data.results);
      setPaginationData({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError("Failed to fetch contributors.");
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Search contributor by ID
  const searchContributorById = async () => {
    setContributorData(null);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/contributors/${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setContributorData(response.data);
      console.log(contributorData);
    } catch (err) {
      setError(`Error fetching contributor with ID: ${searchId}`);
      console.log("Error , ", err.response.data.code);
    }
  };

  useEffect(() => {
    fetchContributors();
  }, []);

  const handleNextPage = () => {
    if (paginationData.next) {
      setCurrentPage(currentPage + 1);
      fetchContributors(currentPage + 1, 5); // Fetch the next page
    }
  };

  const handlePreviousPage = () => {
    if (paginationData.previous && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchContributors(currentPage - 1, 5); // Fetch the previous page
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Contributors</h2>

      {/* Search contributor by ID or Name */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Contributor by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={searchContributorById}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search by ID
        </button>
      </div>

      {/* Error handling */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Display contributor data when searched by ID */}
      {contributorData && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Contributor Details</h3>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-lg font-bold">{contributorData.name || "N/A"}</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Contributor Button */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleOpen}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add New Contributor
        </button>
      </div>

      {/* Modal to add new contributor */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Contributor</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={contributorDataSingle.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleAddContributor}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Add Contributor
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

      {/* Modal to edit contributor */}
      {editOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Contributor</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={contributorDataSingle.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  onClick={handleUpdateContributor}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Update Contributor
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

      {/* Contributors Table */}
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((contributor) => (
            <tr key={contributor.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{contributor.id}</td>
              <td className="py-2 px-4 border-b">{contributor.name}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleEditOpen(contributor)}
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

      {/* No contributors found */}
      {!loading && contributors.length === 0 && !error && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mt-4">
          No contributors found.
        </div>
      )}
    </div>
  );
}

export default Contributors;