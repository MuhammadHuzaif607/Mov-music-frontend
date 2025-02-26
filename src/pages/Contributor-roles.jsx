import { useEffect, useState } from "react";
import axios from "axios";
import apiClient from "../utils/apiClient";

function ContributorRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [roleData, setRoleData] = useState(null);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const accessToken = localStorage.getItem("accessToken");

  // Fetch all contributor roles
  const fetchRoles = async (page = 1, pageSize = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/contributor-roles/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: page, // Pass the page number
          page_size: pageSize, // Pass the page size
        },
      });
      setRoles(response.data.results);
      setPaginationData({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError("Failed to fetch contributor roles.");
      console.log("Error: ", err);
    } finally {
      setLoading(false);
    }
  };

  // Search contributor role by ID
  const searchRoleById = async () => {
    setRoleData(null);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/v1/contributor-roles/${searchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setRoleData(response.data);
      console.log(roleData);
    } catch (err) {
      setError(`Error fetching contributor role with ID: ${searchId}`);
      console.log("Error , ", err.response.data.code);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleNextPage = () => {
    if (paginationData.next) {
      setCurrentPage(currentPage + 1);
      fetchRoles(currentPage + 1, 5); // Fetch the next page
    }
  };

  const handlePreviousPage = () => {
    if (paginationData.previous && currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchRoles(currentPage - 1, 5); // Fetch the previous page
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Contributor Roles</h2>

      {/* Search contributor role by ID */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Contributor Role by ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={searchRoleById}
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

      {/* Display contributor role data when searched by ID */}
      {roleData && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Contributor Role Details</h3>
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-lg font-bold">{roleData.name || "N/A"}</h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Contributor Roles Table */}
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{role.id}</td>
              <td className="py-2 px-4 border-b">{role.name}</td>
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

      {/* No contributor roles found */}
      {!loading && roles.length === 0 && !error && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mt-4">
          No contributor roles found.
        </div>
      )}
    </div>
  );
}

export default ContributorRoles;