import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Import the Login component
import Artist from './pages/Artist'; // Import the Artist component
import Contributors from './pages/Contributors';
import Dashboard from './pages/Dashboard';
import Delivery_Confirmation from './pages/Delivery-Confirmation';
import User from './pages/Users';
import Genres from './pages/Genres';
import ContributorRoles from './pages/Contributor-roles';
import SubGenres from './pages/SubGenres';
import Labels from './pages/Labels';
import UploadFile from './pages/obtainSignedUrl';
import Publishers from './pages/Publishers';
import FeatureRequests from './pages/Feature-request';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Artist />} />
          <Route path="contributors" element={<Contributors />} />
          <Route path="genres" element={<Genres />} />
          <Route path="subgenres" element={<SubGenres />} />
          <Route
            path="ddex-delivery-confirmations"
            element={<Delivery_Confirmation />}
          />
          <Route path="users" element={<User />} />
          <Route path="contributorroles" element={<ContributorRoles />} />
          <Route path="labels" element={<Labels />} />
          <Route path="uploadFile" element={<UploadFile />} />
          <Route path="publishers" element={<Publishers />} />
          <Route path="featurerequests" element={<FeatureRequests />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
