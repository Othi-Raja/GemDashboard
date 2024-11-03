import React, { useEffect, useState } from 'react';
import Slider from '../Slider';
import { Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { TextField, Select, Button, MenuItem, InputLabel, FormControl } from '@mui/material';
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";
import { firestoreDb } from '../firebaseConfig';
import BarLoader from "react-spinners/BarLoader";
import image from '../assets/imageNOTFOUND.png'
import '../App.css';
import UserDetailsSlider from './slideDetails';
export default function RiderDetails() {
  const [ridesData, setRidesData] = useState([]);
  const [limitCount, setLimitCount] = useState(5);
  const [showApprovedOnly, setShowApprovedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleCardClick = (ride) => {
    setSelectedRide(ride); // Open UserDetailsSlider
  };
  const handleCloseSlider = () => {
    setSelectedRide(null); // Close slider
  };
  function formatTimestamp(timestamp) {
    if (!timestamp) return 'No data available';
    const date = timestamp.toDate();
    return date.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  }
  useEffect(() => {
    const fetchUserData = async () => {
      if (loading) return;
      setLoading(true);
      try {
        const usersQuery = query(collection(firestoreDb, 'users'));
        const usersSnapshot = await getDocs(usersQuery);
        const userMap = {};
        usersSnapshot.forEach(userDoc => {
          const userData = userDoc.data();
          userMap[userDoc.id] = {
            name: userData.name || 'Unknown User',
            image: userData.image || image,
            number: userData.number || 'Unknown Number',
            userID: userDoc.id

          };
          // console.log(userDoc.id);

        });

        const ridesDataPromises = Object.keys(userMap).map(async userId => {
          const ridesQuery = query(
            collection(firestoreDb, `users/${userId}/rides`),
            where("status", "==", showApprovedOnly ? "approved" : "pending"),
            where("rideverf", "==", showApprovedOnly ? "verified" : ""),
            limit(limitCount)
          );
          console.log(limitCount);
          const ridesSnapshot = await getDocs(ridesQuery);
          return ridesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            userName: userMap[userId].name,
            image: userMap[userId].image,
            number: userMap[userId].number,
            userID: userMap[userId].userID

          }));
        });
        const ridesData = await Promise.all(ridesDataPromises);
        setRidesData(ridesData.flat());
      } catch (error) {
        console.error("Error fetching data from Firestore:", error);
        setRidesData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [limitCount,showApprovedOnly,loading]);
  const filteredRidesData = ridesData.filter(ride =>
    ride.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ride.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <>
      {localStorage.getItem('Auth') === 'true' && (
        <div className="rider-details-container d-flex" style={{ height: '100vh' }}>
          <div style={{ width: 'auto', flexShrink: 0 }}>
            <Slider />
          </div>
          <div className="flex-fill" style={{ padding: '20px', overflowY: 'auto', overflowX: "hidden" }}>
            <div className='left-panel' style={{ flex: 1 }}>
              <Nav className="navbar navbar-light border-bottom sticky-top" style={{ width: '100%', position: 'sticky', zIndex: 1, backgroundColor: 'white' }}>
                <div className='d-flex align-items-center mt-2'>
                  <Link to='/Dashboard' className='me-2 text-decoration-none text-black-50'>
                    <FaArrowLeft />
                  </Link>
                  <span style={{ fontSize: '18px' }} className='mb-0'>All Rides</span>
                </div>
              </Nav>
              <div className='mt-4'>
                <Row className="d-flex align-items-center w-100">
                  <Col>
                    <button
                      className={`pending-Btn shadow-none ${!showApprovedOnly ? 'active' : ''}`}
                      onClick={() => setShowApprovedOnly(false)}
                    >
                      Pending Users
                    </button>
                    <button
                      className={`approved-btn shadow-none ${showApprovedOnly ? 'active' : ''}`}
                      onClick={() => setShowApprovedOnly(true)}
                    >
                      Approved Rides
                    </button>
                  </Col>
                  <Col className="d-flex justify-content-end " >
                    <TextField
                      variant="standard" 
                      className='pt-3'
                      placeholder="Search..."
                      autoComplete='false'
                      size="large"
                      style={{ marginRight: '10px' }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FormControl   variant="standard"  size="small" style={{ minWidth: '120px', marginRight: '10px' }}>
                      <InputLabel className='bg-white '>Default View</InputLabel>
                      <Select>
                        <MenuItem value="option1">Default View</MenuItem>
                        <MenuItem value="option1">Group By User</MenuItem>
                        <MenuItem value="option2">Group By Date</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>
                <Row className='mt-4'>
                  {filteredRidesData.length > 0 ? (
                    filteredRidesData.map(ride => (
                      <Col key={ride.id} md={4} className='mb-4 cursor-pointer '>
                        <div
                          className='card text-black d-flex align-items-center custm-User-Card overflow-hidden'
                          onClick={() => handleCardClick(ride)}
                          style={{
                            backgroundColor: selectedRide && selectedRide.id === ride.id ? '#d4edda' : '#fff',
                            border: selectedRide && selectedRide.id === ride.id ? '1px solid #28a745' : '1px solid #ddd',
                            borderRadius: '10px', width: '400px', height: '100px', margin: '10px', display: 'flex', flexDirection: 'row', padding: '10px'
                          }}
                        >
                          <img src={ride.image} alt="Ride" className='rounded-circle' loading='lazy' style={{ width: '80px', height: '80px', marginRight: '10px', objectFit: 'cover' }} />
                          <div style={{ flex: 1 }}>
                            <span className='card-title text-black Rd-userName' style={{ margin: '0', fontSize: '1rem' }}>{ride.userName}</span> <br />
                            <span className='card-title text-black Rd-userName' style={{ margin: '0', fontSize: '.6rem' }}>{formatTimestamp(ride.startTime)}</span> <br />
                            <span className='text-black-50' style={{ fontSize: '0.8rem' }}>{ride.title}</span><br />
                            <span className='text-black-50' style={{ fontSize: '0.8rem' }}>{Math.round(ride.distance)} KM</span>
                          </div>
                          <div>
                            <FaArrowRight className='arrow-hover' />
                          </div>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <div className='w-100 d-flex justify-content-center align-items-center' style={{ height: '50vh' }}>
                      <BarLoader />
                    </div>
                  )}
                </Row>
                {selectedRide ? (
                  <UserDetailsSlider
                    ride={selectedRide}
                    onClose={handleCloseSlider}
                    className="slide-in"
                  />
                ) : null}
                {filteredRidesData.length > 0 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Button variant="contained" color="primary" onClick={() => setLimitCount(limitCount + 5)}>
                      Show More
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
