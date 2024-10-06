import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Components/App.css';

import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard.jsx';
import Admin from './Components/Admin.jsx';
import RiderDetails from './Components/RiderDetails.jsx';

const App = () => {
  return (
    <>
      <ToastContainer />
      {/* The routes are handled in the main render */}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Rider" element={<RiderDetails />} />

        <Route path="/" element={<Admin />} /> {/* Show Admin component at root */}
        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
