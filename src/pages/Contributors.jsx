import { useState, useEffect } from 'react';
import apiClient from '../utils/apiClient';
import AddContributor from '../components/addContributorsModal';
import UpdateContributor from '../components/updateContributor';

const ContributorsTable = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paginationData, setPaginationData] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const accessToken = localStorage.getItem('accessToken');

  const fetchContributors = async (page = 1, pageSize = 5) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/contributors', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: page,
          page_size: pageSize,
        },
      });
      setContributors(response.data.results);
      setPaginationData({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
    } catch (err) {
      setError('Failed to fetch contributors.');
      console.log('Error: ', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributors(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (paginationData.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginationData.previous) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <AddContributor
        accessToken={accessToken}
        fetchContributors={fetchContributors}
      />

      <UpdateContributor
        accessToken={accessToken}
        fetchContributors={fetchContributors}
      />

      <>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <>
            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                </tr>
              </thead>
              <tbody>
                {contributors.length > 0 ? (
                  contributors.map((contributor) => (
                    <tr key={contributor.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{contributor.id}</td>
                      <td className="py-2 px-4 border-b">{contributor.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-4">
                      No contributors available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mt-4 flex justify-between">
              <button
                onClick={handlePreviousPage}
                disabled={!paginationData.previous}
                className={`px-4 py-2 bg-gray-300 text-gray-700 rounded ${
                  !paginationData.previous ? 'cursor-not-allowed' : ''
                }`}
              >
                Previous
              </button>

              <button
                onClick={handleNextPage}
                disabled={!paginationData.next}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${
                  !paginationData.next ? 'cursor-not-allowed' : ''
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
      </>
    </>
  );
};

export default ContributorsTable;
