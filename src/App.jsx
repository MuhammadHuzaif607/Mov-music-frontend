import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Import the Login component
import Artist from './pages/Artist'; // Import the Artist component
import Contributors from './pages/Contributors';
import Dashboard from './pages/Dashboard';
import Delivery_Confirmation from './pages/Delivery-Confirmation';
import User from './pages/Users';
import Genres from './pages/Genres';
import ContributorRoles from './pages/Contributor-roles';
import Trends from './pages/Trends';
import Tracks from './pages/Tracks';
import StoreUrls from './pages/Store_url';
import Statements from './pages/Statements';
import ReleaseUserDeclaration from './pages/Release_declaration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Artist />} />
          <Route path="contributors" element={<Contributors />} />
          <Route path="genres" element={<Genres />} />
          <Route
            path="ddex-delivery-confirmations"
            element={<Delivery_Confirmation />}
          />
          <Route path="users" element={<User />} />
          <Route path="contributorroles" element={<ContributorRoles />} />
          <Route path="trends" element={<Trends />} />
          <Route path="tracks" element={<Tracks />} />
          <Route path="store-urls" element={<StoreUrls />} />
          <Route path="statements" element={<Statements />} />
          <Route path="release-user-declaration" element={<ReleaseUserDeclaration />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
