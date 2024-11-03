import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Components/App.css';
import 'aos/dist/aos.css';
import { ToastContainer } from 'react-toastify';

const Admin = React.lazy(() => import('./Components/Admin.jsx'));
const Events = React.lazy(() => import('./Components/Events/Eventscards.jsx'));
const EventF = React.lazy(() => import('./Components/Events/Event.jsx'));
const Dashboard = React.lazy(() => import('./Components/Dashboard.jsx'));
const RiderDetails = React.lazy(() => import('./Components/Rides/RiderDetails.jsx'));
const AuthError = React.lazy(() => import('./Components/error/autherror.jsx'));

// Create a ProtectedRoute component
const ProtectedRoute = ({ element }) => {
  const isAuth = localStorage.getItem('Auth');
  return isAuth ? element : <Navigate to="/error" />;
};

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/Dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/error" element={<AuthError />} />
          <Route path="/Rider" element={<ProtectedRoute element={<RiderDetails />} />} />
          <Route path="/Events" element={<ProtectedRoute element={<Events />} />} />
          <Route path="/CreateCard" element={<ProtectedRoute element={<EventF />} />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    <App />
 
);

reportWebVitals();
