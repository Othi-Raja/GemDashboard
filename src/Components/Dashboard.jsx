import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';
import Sidebar from './Slider.jsx';
import { Link } from 'react-router-dom';
import { Row, Col, Nav } from 'react-bootstrap';
import { collection, getDocs } from "firebase/firestore";
import { firestoreDb } from './firebaseConfig.jsx';
import Skeleton  from '@mui/material/Skeleton'; // Import MUI loader
// import Box from '@mui/material/Box';

export default function Dashboard() {
  const [Len, setLength] = useState(0);
  const [loading, setLoading] = useState(true); // State to manage loading

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const querySnapshot = await getDocs(collection(firestoreDb, 'users', 'rides', 'rides'));
        // setLength(querySnapshot.size); // Get the count of documents
        const querySnapshot = await getDocs(collection(firestoreDb, 'users')); // Replace 'users' with your collection name
        setLength(querySnapshot.size); 
        // console.log(querySnapshot);
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
      } finally {
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      <div style={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <div className="flex-fill d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
          <Nav className="navbar navbar-light border-bottom" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
            <div className="container-fluid d-flex justify-content-end">
              <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ height: '50px', background: 'grey', width: '50px' }}>
                <span className="text-black mx-2" style={{ fontWeight: '800', fontSize: '24px' }}>O</span>
              </div>
            </div>
          </Nav>
          <div className="content flex-grow-1 mx-5">
            <Row className='d-flex gap-4'>
              <Col lg={2} md={6} sm={12} className='text-black'>
              {loading ? (
                     
                     
                     <Skeleton style={{ width: '100%', height:'100%' ,borderRadius:'13px' }} />  
                 
                   
                  ) : (

                <div className='content-card-d'>
                  <div className='content-card-title text-white'>
                    All Rides
                  </div>
                  <Link to='/Rider' className='text-center pt-4 d-flex justify-content-center text-decoration-none'>
                    <h5 className='text-black text-decoration-none'>{Len}</h5>
                  </Link>
                </div>
                  )}
              </Col>
              <Col lg={2} md={6} sm={12} className='text-black'>
                <div className='content-Eventcard-d d-flex justify-content-center align-items-center'>
                  <Link to='/Events' className='text-decoration-none'>
                    <h5 className='text-black text-decoration-none'>EVENTS</h5>
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
}
