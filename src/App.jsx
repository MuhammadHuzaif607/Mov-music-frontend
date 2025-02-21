import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login'; // Import the Login component
import Artist from './pages/Artist'; // Import the Artist component
import Contributors from './pages/Contributors';
import Dashboard from './pages/Dashboard';
import Delivery_Confirmation from './pages/Delivery-Confirmation';
import Genres from './pages/Genres';

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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
