import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Icons for retractable sidebar

function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true); // State to toggle sidebar

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-gray-800 p-4 text-white duration-300 transition-all`}
      >
        <button
          className="text-white mb-4 focus:outline-none"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <nav>
          {/* Links */}
          <ul>
            <li className="mb-4">
              <Link to="/dashboard" className="hover:text-gray-400">
                Artist
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/dashboard/contributors"
                className="hover:text-gray-400"
              >
                Contributors
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/dashboard/ddex-delivery-confirmations"
                className="hover:text-gray-400"
              >
                Delivery Confirmations
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/dashboard/genres"
                className="hover:text-gray-400"
              >
                Genres
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/dashboard/contributorroles"
                className="hover:text-gray-400"
              >
                Contributor Roles
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
