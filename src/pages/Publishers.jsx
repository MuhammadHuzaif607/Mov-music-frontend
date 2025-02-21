import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";

const Publishers = () => {
    const [publishers, setPublishers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newPublisher, setNewPublisher] = useState("");
    const [editPublisherId, setEditPublisherId] = useState(null);
    const [editPublisherName, setEditPublisherName] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        fetchPublishers();
    }, [search, page, pageSize]);

    const fetchPublishers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiClient.get("/publishers", {
                params: { search, page, page_size: pageSize },
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setPublishers(response.data.results);
        } catch (error) {
            setError("Failed to fetch publishers.");
        }
        setLoading(false);
    };

    const handleAddPublisher = async () => {
        if (!newPublisher) return alert("Enter publisher name!");
        try {
            await apiClient.post(
                "/publishers",
                { name: newPublisher },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setNewPublisher("");
            fetchPublishers();
        } catch (error) {
            setError("Failed to add publisher.");
        }
    };

    const handleEditClick = (publisher) => {
        setEditPublisherId(publisher.id);
        setEditPublisherName(publisher.name);
    };

    const handleUpdatePublisher = async () => {
        if (!editPublisherName) return alert("Enter publisher name!");
        try {
            await apiClient.put(
                `/publishers/${editPublisherId}`,
                { name: editPublisherName },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setEditPublisherId(null);
            fetchPublishers();
        } catch (error) {
            setError("Failed to update publisher.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Manage Publishers</h1>

            {error && <p className="text-red-500 text-center mb-2">{error}</p>}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search publishers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="border p-2 w-full rounded"
                />
            </div>

            <div className="mb-4 flex space-x-2">
                <input
                    type="text"
                    placeholder="Add new publisher"
                    value={newPublisher}
                    onChange={(e) => setNewPublisher(e.target.value)}
                    className="border p-2 w-full rounded"
                />
                <button onClick={handleAddPublisher} className="bg-green-500 text-white px-4 py-2 rounded">
                    Add
                </button>
            </div>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <ul className="divide-y">
                    {publishers.map((publisher) => (
                        <li key={publisher.id} className="py-2 flex justify-between items-center">
                            {editPublisherId === publisher.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editPublisherName}
                                        onChange={(e) => setEditPublisherName(e.target.value)}
                                        className="border p-2 w-full rounded"
                                    />
                                    <button onClick={handleUpdatePublisher} className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
                                        Update
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span>{publisher.name}</span>
                                    <button onClick={() => handleEditClick(publisher)} className="bg-yellow-500 text-white px-4 py-2 rounded">
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

export default Publishers;