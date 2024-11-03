import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Nav } from 'react-bootstrap';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { firestoreDb } from '../firebaseConfig';
import { Link } from 'react-router-dom';
import Sidebar from '../Slider.jsx';
import { Container, Col, Card } from 'react-bootstrap';
import { Button } from '@mui/material';
import { IoCalendarNumberOutline } from "react-icons/io5";
import { CiLocationOn } from "react-icons/ci";
import './event.css'
import RiderDetails from '../Rides/RiderDetails.jsx';
// Import other components as needed
export default function Events() {
  const [contests, setContests] = useState([]); // State to store subcollection data
  const [selectedComponent, setSelectedComponent] = useState(null); // State to track selected component
  const [alldata, setalldata] = useState([]); // State to store subcollection data
  // Fetch data from Firestore
  // const fetchData = async () => {
  //   try {
  //     const docRef = doc(firestoreDb, 'homescreen', 'promotionContent');
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       // Fetch contests subcollection
  //       const contestsRef = collection(firestoreDb, 'homescreen', 'promotionContent', 'event4');
  //       const contestsSnap = await getDocs(contestsRef);
  //       const contestsData = contestsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  //       setContests(contestsData);
  //     } else {
  //       console.error('No such document!');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  // fetching card data from tickets 
  // Fetch data from Firestore
  const fetchData = async () => {
    try {
      const contestsRef = collection(firestoreDb, 'homescreen', 'promotionContent', 'contests');
      const contestsSnap = await getDocs(contestsRef);
      const contestsData = contestsSnap.docs.map((doc) => {
        // Extract 'tickets' data from each document
        // const tickets = doc.data().tickets || [];
        // return { id: doc.id, tickets };
        const data = doc.data();
        return { id: doc.id, ...data };
      });
      console.log(contestsData);
      setContests(contestsData); // Update state with contests and tickets
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  // ------------------------------------   // Format: 21 NOV 11AM - 21 NOV 1PM
  console.log(contests);
  // Helper function to format date range
  const formatDateRange = (startTD, endTD) => {
    const startDate = new Date(startTD);
    const endDate = new Date(endTD);
    const formatOptions = { day: 'numeric', month: 'short', hour: 'numeric', minute: 'numeric', hour12: true };
    const startFormatted = startDate.toLocaleDateString('en-GB', formatOptions);
    const endFormatted = endDate.toLocaleDateString('en-GB', formatOptions);
    // Format: 21 NOV 11AM - 21 NOV 1PM
    return `${startFormatted.toUpperCase()} - ${endFormatted.toUpperCase()}`;
  };
  //----------------------------------------
  // Card Layout for Tickets
  const CardComponent = ({ tickets }) => {
    return (
      <div className="mb-3">
        <Card className='rounded-4'>
          <div style={{ overflow: 'hidden', position: 'relative', width: '100%', height: '200px', backgroundColor: '#f0f0f0' }}>
            {tickets.images ? (
              <img
                className="rounded-4 rounded-bottom-0"
                src={tickets.images}
                alt="event poster"
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  color: '#888',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                }}
              >
                No Image
              </div>
            )}
          </div>
          <Card.Body>
            <span className=' fs-4 fw-bolder'>
              {tickets.title}
            </span><br />
            <span className='text-xs'><IoCalendarNumberOutline className='d-inline mx-2 ' size={18} />
              {formatDateRange(tickets.startTD, tickets.endTD)}
            </span><br />
            <span className='text-sm capitalize'>
              <CiLocationOn className='d-inline mx-2' size={18} />
              {Array.isArray(tickets.location) ? (
                tickets.location.map((value, index) => (
                  <span key={index}>{value.address}</span>
                ))
              ) : (
                <span>{tickets.location?.address || "Location not available"}</span>
              )}
            </span>
            {/* <br />
            <div className='text-center mt-4 uppercase'>
              <Button variant="outlined">{tickets.buttonName || 'Register Now'}</Button>
            </div> */}
          </Card.Body>
        </Card>
      </div>
    );
  };
  // --------------------------------------------
  useEffect(() => {
    fetchData();
  }, []);
  // Function to handle button click and set the corresponding component
  const handleComponentChange = (component) => {
    setSelectedComponent(component);
  };
  return (
    <div>
      <div style={{ display: 'flex', height: '100vh' }}>
        {/* Left Sidebar */}
        <Sidebar />
        <div className="flex-fill d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
          <Nav className="navbar navbar-light border-bottom" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
            <div className="container-fluid d-flex justify-content-end">
              <div className='d-flex justify-content-center align-items-center rounded-circle' style={{ height: '50px', background: 'grey', width: '50px' }}>
                <span className="text-black mx-2 " style={{ fontWeight: '800', fontSize: '24px' }}>O</span>
              </div>
            </div>
          </Nav>
          {/* Main Content Area */}
          <div className="content flex-grow-1 mx-5">
            <Row className="d-flex justify-content-start align-items-center">
              <div className="d-flex gap-5 mt-4"> {/* Flex container for Links */}
                <Link
                  onClick={() => handleComponentChange('Live')}
                  className='btn bg-black text-white mb-3 mt-1 px-5 event-button-list'>
                  Live
                </Link>
                <Link
                  onClick={() => handleComponentChange('Approved')}
                  className='btn  event-button-list'
                  style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                    fontWeight: 'bold',
                    outline: 'none',
                    border: 'none',
                  }}
                >
                  Approved
                </Link>
                <Link
                  onClick={() => handleComponentChange('Pending')}
                  className='btn   event-button-list'
                  style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                    fontWeight: 'bold',
                    outline: 'none',
                    border: 'none',
                  }}
                >
                  Pending
                </Link>
                <Link
                  onClick={() => handleComponentChange('reject')}
                  className='btn   event-button-list'
                  style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                    fontWeight: 'bold',
                    outline: 'none',
                    border: 'none',
                  }}
                >
                  Rejected
                </Link>
                <Link
                  onClick={() => handleComponentChange('Past')}
                  className='btn   event-button-list'
                  style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                    fontWeight: 'bold',
                    outline: 'none',
                    border: 'none',
                  }}
                >
                  Past
                </Link>
                <Link
                  onClick={() => handleComponentChange('All')}
                  className='btn  event-button-list focus:outline-none active:outline-none '
                  style={{
                    backgroundColor: 'transparent',
                    color: 'black',
                    fontWeight: 'bold',
                    outline: 'none',
                    border: 'none',
                  }}
                >
                  All
                </Link>
                <Link to='/CreateCard' target='__blank' className='btn bg-black text-white mb-3 rounded-3'>
                  Create
                </Link>
              </div>
            </Row>
            {/* Conditionally render the selected component */}
            <div className="mt-4">
              {selectedComponent === 'Live' && <div>Live Component Content</div>}
              {selectedComponent === 'Approved' && <div>Approved Component Content</div>}
              {selectedComponent === 'Pending' && <div>Pending Component Content</div>}
              {selectedComponent === 'reject' && <div>reject Component Content</div>}
              {selectedComponent === 'Past' && <div>Past Component Content</div>}
              {selectedComponent === 'All' && <div>
                <Container style={{ maxHeight: '100vh', overflowY: 'auto' }}>
                  <Row>
                    {contests.map((contest) => (
                      <Col sm={4}>
                        <div key={contest.id} className="mb-3"> {/* Adjusted column sizes */}
                          <CardComponent tickets={contest} />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Container>
              </div>}
              {selectedComponent === <RiderDetails /> && <RiderDetails />} {/* RiderDetails component */}
            </div>
          </div>
        </div>
      </div>
      {/* Uncomment to display contests data */}
    </div>
  );
}
