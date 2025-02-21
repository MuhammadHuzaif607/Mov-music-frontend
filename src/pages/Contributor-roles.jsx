import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

const ContributorRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchedRole, setSearchedRole] = useState(null);
  const accessToken = localStorage.getItem("accessToken");

  // Fetch all contributor roles
  const fetchRoles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/contributor-roles/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRoles(response.data.results);
    } catch (err) {
      setError("Failed to fetch contributor roles.");
      console.error("Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search for a contributor role by ID
  const searchRoleById = async () => {
    if (!searchId) {
      setError("Please enter a Contributor Role ID.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.get(`/contributor-roles/${searchId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSearchedRole(response.data);
    } catch (err) {
      setError("Contributor role not found. Please enter a valid ID.");
      console.error("Error fetching role by ID:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Contributor Roles</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="number"
          placeholder="Enter Role ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={searchRoleById}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {/* Display Searched Contributor Role */}
      {searchedRole && (
        <div className="p-4 border rounded-lg shadow-sm bg-gray-100 mb-6">
          <h2 className="text-xl font-semibold text-blue-600">{searchedRole.name}</h2>
        </div>
      )}

      {/* Display All Contributor Roles */}
      {loading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin h-10 w-10 border-t-2 border-blue-500 rounded-full"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-lg font-semibold">{error}</div>
      ) : (
        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-blue-600">{role.name}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContributorRoles;