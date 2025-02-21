import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";

const FeatureRequests = () => {
    const [featureRequests, setFeatureRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newFeatureRequest, setNewFeatureRequest] = useState({
        release: "",
        dj_tastemaker: "",
        radio_support: "",
        marketing_pr: "",
        label_reach: "",
        artist_remixer: ""
    });
    const [editFeatureRequestId, setEditFeatureRequestId] = useState(null);
    const [editFeatureRequest, setEditFeatureRequest] = useState({});
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchFeatureRequests();
    }, [search, page, pageSize]);

    const fetchFeatureRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("/feature-request", {
                params: { search, page, page_size: pageSize },
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setFeatureRequests(response.data.results);
        } catch (error) {
            setError("Failed to fetch feature requests.");
        }
        setLoading(false);
    };

    const handleAddFeatureRequest = async () => {
        try {
            await apiClient.post("/feature-request", newFeatureRequest, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setNewFeatureRequest({
                release: "",
                dj_tastemaker: "",
                radio_support: "",
                marketing_pr: "",
                label_reach: "",
                artist_remixer: ""
            });
            fetchFeatureRequests();
        } catch (error) {
            console.log(error);
            const errorMsg = error.response?.data?.release?.[0] || "Failed to add feature request.";
            setError(errorMsg);
        }
    };

    const handleEditClick = (feature) => {
        setEditFeatureRequestId(feature.id);
        setEditFeatureRequest(feature);
    };

    const handleUpdateFeatureRequest = async () => {
        try {
            await apiClient.put(`/feature-request/${editFeatureRequestId}`, editFeatureRequest, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setEditFeatureRequestId(null);
            fetchFeatureRequests();
        } catch (error) {
            setError("Failed to update feature request.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Manage Feature Requests</h1>

            {error && <p className="text-red-500 text-center mb-2">{error}</p>}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search feature requests..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
                {Object.keys(newFeatureRequest).map((key) => (
                    <input
                        key={key}
                        type="text"
                        placeholder={key.replace("_", " ")}
                        value={newFeatureRequest[key]}
                        onChange={(e) => setNewFeatureRequest({ ...newFeatureRequest, [key]: e.target.value })}
                        className="border p-2 rounded"
                    />
                ))}
                <button onClick={handleAddFeatureRequest} className="bg-green-500 text-white px-4 py-2 rounded">
                    Add
                </button>
            </div>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : featureRequests.length === 0 ? (
                <p className="text-center text-gray-500">No feature requests found.</p>
            ) : (
                <ul className="divide-y">
                    {featureRequests.map((feature) => (
                        <li key={feature.id} className="py-2 flex justify-between items-center">
                            {editFeatureRequestId === feature.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editFeatureRequest.dj_tastemaker}
                                        onChange={(e) => setEditFeatureRequest({ ...editFeatureRequest, dj_tastemaker: e.target.value })}
                                        className="border p-2 w-full rounded"
                                    />
                                    <button onClick={handleUpdateFeatureRequest} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
                                        Update
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span>{feature.dj_tastemaker}</span>
                                    <button onClick={() => handleEditClick(feature)} className="bg-yellow-500 text-white px-4 py-2 rounded">
                                        Edit
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-4 flex justify-between">
                <button onClick={() => setPage(page - 1)} disabled={page === 1} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Previous
                </button>
                <button onClick={() => setPage(page + 1)} className="bg-gray-500 text-white px-4 py-2 rounded">
                    Next
                </button>
            </div>
        </div>
    );
};

export default FeatureRequests;