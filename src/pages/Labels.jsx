import { useState, useEffect } from "react";
import apiClient from "../utils/apiClient";

const Labels = () => {
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchId, setSearchId] = useState("");
    const [searchedLabel, setSearchedLabel] = useState(null);
    const [labelName, setLabelName] = useState("");
    const [validateMessage, setValidateMessage] = useState(null);
    const accessToken = localStorage.getItem("accessToken");

    // Fetch all labels
    const fetchLabels = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("/labels/", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(response.data);
            setLabels(response.data.results);
        } catch (err) {
            setError("Failed to fetch labels.");
            console.error("Error fetching labels:", err);
        } finally {
            setLoading(false);
        }
    };

    // Search for a label by ID
    const searchLabelById = async () => {
        if (!searchId) {
            setError("Please enter a Label ID.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const response = await apiClient.get(`/labels/${searchId}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setSearchedLabel(response.data);
        } catch (err) {
            setError("Label not found. Please enter a valid ID.");
            console.error("Error fetching label by ID:", err);
        } finally {
            setLoading(false);
        }
    };

    // Validate label name
    const validateLabelName = async () => {
        if (!labelName) {
            setValidateMessage("Please enter a label name.");
            return;
        }
        try {
            await apiClient.post(
                "/labels/validate-label-name/",
                { label_name: labelName },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setValidateMessage("✅ This Label name is valid!");
        } catch (err) {
            setValidateMessage("❌ This Label name is already taken.");
            console.error("Label validation error:", err);
        }
    };

    useEffect(() => {
        fetchLabels();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Labels</h1>

            {/* Search Bar */}
            <div className="flex justify-center mb-6">
                <input
                    type="number"
                    placeholder="Enter Label ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={searchLabelById}
                    className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
                >
                    Search
                </button>
            </div>

            {/* Display Searched Label */}
            {searchedLabel && (
                <div className="p-4 border rounded-lg shadow-sm bg-gray-100 mb-6">
                    <h2 className="text-xl font-semibold text-blue-600">{searchedLabel.name}</h2>
                    <p className="text-gray-700">Genre: {searchedLabel.primary_genre}</p>
                    <p className="text-gray-700">Year: {searchedLabel.year}</p>
                    <img src={searchedLabel.logo} alt="Label Logo" className="w-20 mt-2" />
                </div>
            )}

            {/* Label Name Validation */}
            <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Validate Label Name</h2>
                <div className="flex justify-center items-center">
                    <input
                        type="text"
                        placeholder="Enter Label Name"
                        value={labelName}
                        onChange={(e) => setLabelName(e.target.value)}
                        className="border border-gray-300 p-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                    <button
                        onClick={validateLabelName}
                        className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition"
                    >
                        Validate
                    </button>
                </div>
                {validateMessage && (
                    <p className={`mt-2 ${validateMessage.includes("✅") ? "text-green-600" : "text-red-600"}`}>
                        {validateMessage}
                    </p>
                )}
            </div>

            {/* Display All Labels */}
            {loading ? (
                <div className="flex justify-center items-center h-20">
                    <div className="animate-spin h-10 w-10 border-t-2 border-blue-500 rounded-full"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 text-lg font-semibold">{error}</div>
            ) : (
                <div className="space-y-4">
                    {labels.map((label) => (
                        <div key={label.id} className="p-4 border rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold text-blue-600">{label.name}</h2>
                            <p className="text-gray-700">Genre: {label.primary_genre}</p>
                            <p className="text-gray-700">Year: {label.year}</p>
                            <p className="text-gray-700">Company: {label.company}</p>
                            {label.logo && <img src={label.logo} alt="Label Logo" className="w-20 mt-2" />}
                            <p className="mt-2 text-sm text-gray-500">
                                {label.contract_received ? "✅ Contract Received" : "❌ Contract Pending"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {label.information_accepted ? "✅ Information Accepted" : "❌ Information Pending"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {label.label_approved ? "✅ Label Approved" : "❌ Approval Pending"}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Labels;