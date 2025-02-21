import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

const SubGenres = () => {
    const [subGenres, setSubGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchId, setSearchId] = useState("");
    const [searchedSubGenre, setSearchedSubGenre] = useState(null);
    const accessToken = localStorage.getItem("accessToken");

    // Fetch all subgenres
    const fetchSubGenres = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("/subgenres/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setSubGenres(response.data.results);
        } catch (err) {
            setError("Failed to fetch subgenres.");
            console.error("Error fetching subgenres:", err);
        } finally {
            setLoading(false);
        }
    };

    // Search for a subgenre by ID
    const searchSubGenreById = async () => {
        if (!searchId) {
            setError("Please enter a SubGenre ID.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await apiClient.get(`/subgenres/${searchId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setSearchedSubGenre(response.data);
        } catch (err) {
            setError("SubGenre not found. Please enter a valid ID.");
            console.error("Error fetching subgenre by ID:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubGenres();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Music SubGenres</h1>

            {/* Search Bar */}
            <div className="flex justify-center mb-6">
                <input
                    type="number"
                    placeholder="Enter SubGenre ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={searchSubGenreById}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
                >
                    Search
                </button>
            </div>

            {/* Display Searched SubGenre */}
            {searchedSubGenre && (
                <div className="p-4 border rounded-lg shadow-sm bg-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-blue-600">{searchedSubGenre.name}</h2>
                </div>
            )}

            {/* Display All SubGenres */}
            {loading ? (
                <div className="flex justify-center items-center h-20">
                    <div className="animate-spin h-10 w-10 border-t-2 border-blue-500 rounded-full"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 text-lg font-semibold">{error}</div>
            ) : (
                <div className="space-y-4">
                    {subGenres.map((subgenre) => (
                        <div key={subgenre.id} className="p-4 border rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-blue-600">{subgenre.name}</h2>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubGenres;