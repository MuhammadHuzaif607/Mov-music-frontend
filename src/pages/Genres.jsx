import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchedGenre, setSearchedGenre] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  // Fetch all genres
  const fetchGenres = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get("/genres/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setGenres(response.data.results);
    } catch (err) {
      setError("Failed to fetch Genres.");
      console.error("Error fetching genres:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search for a genre by ID
  const searchGenreById = async () => {
    if (!searchId) {
      setError("Please enter a Genre ID.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await apiClient.get(`/genres/${searchId}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSearchedGenre(response.data);
    } catch (err) {
      setError("Genre not found. Please enter a valid ID.");
      console.error("Error fetching genre by ID:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">Music Genres</h1>

      {/* Search Bar */}
      <div className="flex justify-center mb-6">
        <input
          type="number"
          placeholder="Enter Genre ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={searchGenreById}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>

      {/* Display Searched Genre */}
      {searchedGenre && (
        <div className="p-4 border rounded-lg shadow-sm bg-gray-100 mb-6">
          <h2 className="text-xl font-semibold text-blue-600">{searchedGenre.name}</h2>
          {searchedGenre.subgenres.length > 0 ? (
            <ul className="mt-2 space-y-1 text-gray-700">
              {searchedGenre.subgenres.map((sub) => (
                <li key={sub.id} className="ml-4 list-disc">
                  {sub.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic mt-1">No subgenres available</p>
          )}
        </div>
      )}

      {/* Display All Genres */}
      {loading ? (
        <div className="flex justify-center items-center h-20">
          <div className="animate-spin h-10 w-10 border-t-2 border-blue-500 rounded-full"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 text-lg font-semibold">{error}</div>
      ) : (
        <div className="space-y-4">
          {genres.map((genre) => (
            <div key={genre.id} className="p-4 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-blue-600">{genre.name}</h2>
              {genre.subgenres.length > 0 ? (
                <ul className="mt-2 space-y-1 text-gray-700">
                  {genre.subgenres.map((sub) => (
                    <li key={sub.id} className="ml-4 list-disc">
                      {sub.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic mt-1">No subgenres available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Genres;