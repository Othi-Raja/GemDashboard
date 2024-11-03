// RideDetailView.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import imageNOTFOUND from '../Components/assets/imageNOTFOUND.png';

const RideDetailView = () => {
  const location = useLocation();
  const { ride } = location.state; // Assuming you pass ride data via state

  return (
    <div className="ride-detail-view-container" style={{ padding: '20px' }}>
      <Link to="/rider-details" className="text-black-50">
        <FaArrowLeft /> Back to Rides
      </Link>
      <Row className="mt-4">
        <Col md={6}>
          <div className="ride-card" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <img src={ride.images || imageNOTFOUND} alt="Ride" style={{ width: '80px', height: '80px', marginRight: '10px' }} />
            <div>
              <h5>{ride.ridername}</h5>
              <p>Status: {ride.status}</p>
            </div>
          </div>
        </Col>
        {/* Duplicate the above for the second ride */}
        <Col md={6}>
          <div className="ride-card" style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <img src={ride.images || imageNOTFOUND} alt="Ride" style={{ width: '80px', height: '80px', marginRight: '10px' }} />
            <div>
              <h5>{ride.ridername}</h5>
              <p>Status: {ride.status}</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RideDetailView;
