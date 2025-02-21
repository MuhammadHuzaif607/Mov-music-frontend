import { useState } from "react";
import apiClient from "../utils/apiClient";

const UploadFile = () => {
    const [file, setFile] = useState(null);
    const [uploadType, setUploadType] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [signedUrlData, setSignedUrlData] = useState(null);
    const accessToken = localStorage.getItem("accessToken");

    const validUploadTypes = {
        "label.logo": { type: "image/jpeg", maxSize: 2 * 1024 * 1024 },
        "label.promo_graphic": { type: "image/jpeg", maxSize: 4 * 1024 * 1024 },
        "release.artwork": { type: "image/jpeg", maxSize: 4 * 1024 * 1024 },
        "release.license": { type: "application/pdf", maxSize: 5 * 1024 * 1024 },
        "track.audio": { type: "audio/wav", maxSize: 159 * 1024 * 1024 },
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setError(null);
        setSignedUrlData(null); // Reset previous signed URL when a new file is selected
    };

    const handleUpload = async () => {
        if (!file || !uploadType) {
            setError("Please select a file and upload type.");
            return;
        }

        const { type, maxSize } = validUploadTypes[uploadType] || {};
        if (!type || !maxSize) {
            setError("Invalid upload type selected.");
            return;
        }

        if (file.type !== type) {
            setError(`Invalid file type. Expected ${type}, but got ${file.type}.`);
            return;
        }

        if (file.size > maxSize) {
            setError(`File size exceeds limit (${maxSize / (1024 * 1024)}MB).`);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage("");

        try {
            const response = await apiClient.get("/obtain-signed-url-for-upload/", {
                params: {
                    filename: file.name,
                    filetype: file.type,
                    upload_type: uploadType,
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log(response.data); // Debugging
            setSignedUrlData(response.data); // Store the signed URL response to display
            setSuccessMessage("Signed URL obtained successfully!");
        } catch (err) {
            console.error("Error obtaining signed URL:", err);
            setError("Failed to obtain signed URL. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-6">Upload a File</h1>

            {error && <p className="text-red-500 text-center mb-2">{error}</p>}
            {successMessage && <p className="text-green-500 text-center mb-2">{successMessage}</p>}

            <div className="mb-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Select File & Upload Type</h2>
                <div className="flex justify-center items-center space-x-2">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                        value={uploadType}
                        onChange={(e) => setUploadType(e.target.value)}
                        className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                        <option value="">Select Upload Type</option>
                        {Object.keys(validUploadTypes).map((type) => (
                            <option key={type} value={type}>{type.replace(".", " - ")}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleUpload}
                        className={`px-4 py-2 rounded-lg text-white ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
                        disabled={loading}
                    >
                        {loading ? "Fetching URL..." : "Get Signed URL"}
                    </button>
                </div>
            </div>

            {/* Display Signed URL Data */}
            {signedUrlData && (
                <div className="mt-6 p-4 border rounded-lg bg-gray-100">
                    <h2 className="text-lg font-semibold">Signed URL Data:</h2>
                    <p><strong>Upload URL:</strong> <a href={signedUrlData.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{signedUrlData.url}</a></p>
                    <p><strong>Key:</strong> {signedUrlData.signed_url.fields.key}</p>
                    <p><strong>Content-Type:</strong> {signedUrlData.signed_url.fields["Content-Type"]}</p>
                    <p><strong>ACL:</strong> {signedUrlData.signed_url.fields.acl}</p>
                    <p><strong>Policy:</strong> {signedUrlData.signed_url.fields.policy}</p>
                    <p><strong>Signature:</strong> {signedUrlData.signed_url.fields.signature}</p>
                </div>
            )}
        </div>
    );
};

export default UploadFile;