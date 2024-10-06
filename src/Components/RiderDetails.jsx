import React, { useEffect, useState } from 'react';
import Slider from './Slider';
import { Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight, FaWhatsapp, FaPhone, FaPen, FaCheck, FaTimes } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import { CiCreditCard1 } from 'react-icons/ci';
import { RiMotorbikeFill } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import data from './UserData.json';
export default function RiderDetails() {
  const [profileImage, setProfileImage] = useState();
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState('');
  const [showApproved, setShowApproved] = useState(true);
  const [groupBy, setGroupBy] = useState('');
  const [openGroups, setOpenGroups] = useState({});
  const [selectedUser, setSelectedUser] = useState(null); // New state for selected user
  useEffect(() => {
    const profileImg = localStorage.getItem('userPhotoURL');
    setProfileImage(profileImg);
  }, []);
  const handlePendingClick = () => {
    setShowApproved(false);
    filterData(false);
  };
  const handleApprovedClick = () => {
    setShowApproved(true);
    filterData(true);
  };
  const filterData = (isApproved) => {
    const filteredUsers = Object.keys(data).filter(key => data[key].Aproval === isApproved);
    setFilteredData(filteredUsers.reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {}));
  };
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filteredUsers = Object.keys(data).filter(key => data[key].Name.toLowerCase().includes(value));
    const usersToDisplay = filteredUsers.filter(key =>
      (showApproved && data[key].Aproval) || (!showApproved && !data[key].Aproval)
    );
    setFilteredData(usersToDisplay.reduce((acc, key) => {
      acc[key] = data[key];
      return acc;
    }, {}));
  };
  const handleGroupByChange = (e) => {
    setGroupBy(e.target.value);
  };
  const toggleGroup = (date) => {
    setOpenGroups(prev => ({ ...prev, [date]: !prev[date] }));
  };
  const handleUserClick = (user) => {
    setSelectedUser(user);  // Set the selected user when a card is clicked
  };
  const handleCloseDetails = () => {
    setSelectedUser(null);  // Close the details by resetting selected user
  };
  const renderData = () => {
    return Object.keys(filteredData).map(key => (
      <div
        className='card text-black d-flex align-items-center custm-User-Card'
        style={{ borderRadius: '10px', width: '400px', height: '100px', margin: '10px', display: 'flex', flexDirection: 'row', padding: '10px' }}
        key={key}
        onClick={() => handleUserClick(filteredData[key])}  // Add onClick to each card
      >
        <img src={filteredData[key].profileImg} className='rounded-circle' alt="profileimg" style={{ width: '80px', height: '80px', marginRight: '10px' }} />
        <div style={{ flex: 1 }}>
          <span className='text-black Rd-userName' style={{ margin: '0' }}>{filteredData[key].Name}</span> <br />
          <span style={{ fontSize: '0.6rem' }}>{filteredData[key].BikeDetails.rideType}</span><br />
          <span className='text-black-50' style={{ fontSize: '0.8rem' }}>{filteredData[key].Date}</span>
          <span className='text-black-50 px-1' style={{ fontSize: '0.8rem' }}>{filteredData[key].Time}</span><br />
          <span className='text-black-50' style={{ fontSize: '0.8rem' }}>{filteredData[key].KM} KM</span>
        </div>
        <div>
          <FaArrowRight className='arrow-hover' />
        </div>
      </div>
    ));
  };
  const renderSelectedUserDetails = () => {
    if (!selectedUser) {
      return null;  // Return null if no user is selected
    }
    return (
      <div className='user-details'>
        <button onClick={handleCloseDetails} className="btn btn-outline-secondary mb-3">Close</button>
        <Row className='d-flex'>
          <Col className='d-flex align-items-start'>
            {/* Left side: Profile Image */}
            <img
              src={selectedUser.profileImg}
              alt="User"
              className='rounded-circle'
              style={{ width: '60px', marginRight: '10px' }}
            />
            {/* Right side: User Info */}
            <div className='text-center'>
              <h5 style={{ margin: '0' }}>{selectedUser.Name}</h5>
              <div>
                <span style={{ fontSize: '0.6rem' }}>{selectedUser.Date}</span>
                <span style={{ fontSize: '0.6rem' }}> {selectedUser.Time}</span>
              </div>
            </div>
            <div className="d-flex mx-3 gap-5">
              <span>
                <a className=' text-black' href={`https://wa.me/${selectedUser.PersonalDetails.whatsappNumber}`}>
                  <FaWhatsapp />
                </a>
              </span>
              <span className='rotate-x-rd text-decoration-none'>
                <a className=' text-black' href={`tel:${selectedUser.PersonalDetails.PhoneNumber}`}>
                  <FaPhone style={{ transform: 'scaleX(-1)' }} />
                </a>
              </span>
              <span> <FaPen /></span>
            </div>
          </Col>
        </Row>
        <Row className="d-flex mx-3 gap-3 mt-3 mb-3">
          <Col>
            <span><CiCreditCard1 size={25} /> {selectedUser.BikeDetails.licence === true ? <IoMdCheckmark color='#22DD22' /> : <LiaTimesSolid color='red' />}</span>
          </Col>
          <Col>
            <span><RiMotorbikeFill size={25} />{selectedUser.BikeDetails.bikeVerified === true ? <IoMdCheckmark color='#22DD22' /> : <LiaTimesSolid color='red' />} </span>
          </Col>
          <Col>
            <span className='text-black-50 '  ><FaLocationDot size={25} />{selectedUser.TotalRide}Km</span>
          </Col>
        </Row>
        <Row className='text-center'>
          <span style={{ fontSize: '16px', fontWeight: '600' }}>{selectedUser.BikeDetails.bikeNumber}</span>
          <span style={{ fontSize: '12px', fontWeight: '600' }}>{selectedUser.BikeDetails.bike}</span>
          <span style={{ fontSize: '12px', fontWeight: '400' }}>{selectedUser.BikeDetails.bikeModel}</span>
          <span className="d-block">
            <FaPen />
          </span>
        </Row>
        <p>{selectedUser.BikeDetails.rideType}</p>
        <p>KM: {selectedUser.KM}</p>
        <p>Pre Ride Odo: <img src={selectedUser.odoImage} alt="Odometer" style={{ width: '100%' }} /></p>
        {/* Add other necessary fields */}
      </div>
    );
  };
  return (
    <>
      {localStorage.getItem('Auth') === 'true' && (
        <div className="rider-details-container d-flex" style={{ height: '100vh' }}>
          <Slider />
          <div className="flex-fill" style={{ padding: '20px', display: 'flex' }}>
            <div className='left-panel' style={{ flex: 1 }}>
              <Nav className="navbar navbar-light border-bottom" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
                <div className="container-fluid d-flex justify-content-end">
                  <img src={profileImage} alt="Profile" className="rounded-circle" width={50} />
                </div>
              </Nav>
              <Row className='d-flex align-items-center'>
                <div className='d-flex mt-2'>
                  <Link to='/Dashboard' className='me-2 text-decoration-none text-black-50 px-3'>
                    <FaArrowLeft />
                  </Link>
                  <h4 className='mb-0'>All Rides</h4>
                </div>
              </Row>
              <div className='mt-4'>
                <Row className="d-flex align-items-center w-100">
                  <Col>
                    <button onClick={handlePendingClick} className="pending-Btn shadow-none">
                      Pending Users
                    </button>
                    <button onClick={handleApprovedClick} className="approved-btn shadow-none">
                      Approved Rides
                    </button>
                  </Col>
                  <Col className="d-flex justify-content-end">
                    <TextField
                      variant="outlined"
                      placeholder="Search..."
                      size="small"
                      value={searchTerm}
                      onChange={handleSearch}
                      style={{ marginRight: '10px' }}
                    />
                    <FormControl variant="outlined" size="small" style={{ minWidth: '120px', marginRight: '10px' }}>
                      <InputLabel className='bg-white'>Default View</InputLabel>
                      <Select value={groupBy} onChange={handleGroupByChange}>
                        <MenuItem value="">Default View</MenuItem>
                        <MenuItem value="option1">Group By User</MenuItem>
                        <MenuItem value="option3">Group By Date</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                </Row>
                <div className='container custm-user-card mt-4' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {renderData()}
                </div>
              </div>
            </div>
            {/* Only show the right-panel if a user is selected */}
            {selectedUser && (
              <div className='right-panel' style={{ flex: .5, padding: '20px', borderLeft: '1px solid #ccc' }}>
                {renderSelectedUserDetails()}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
