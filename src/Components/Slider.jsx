import React, { useState } from 'react';
import logo from './assets/AppLogo_copy-removebg.png';
import dashIcon from './assets/ic_sharp-dashboard.png';
import rightarroeBtn from './assets/right-arrows.png';
import leftarroeBtn from './assets/left-arrows.png';
import powerIcon from './assets/power.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);



  const handleLogout = () => {
    localStorage.removeItem('Auth');
    localStorage.removeItem('userPhotoURL');
    localStorage.removeItem('userDisplayName');
    localStorage.removeItem('userEmail');
    console.log('User logged out');
    navigate('/');
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div
        className={`sidebar${isCollapsed ? ' collapsed' : ''}`}
        style={{
          width: isCollapsed ? '100px' : '200px',
          background: '#f8f9fa',
          borderRight: '1px solid #dee2e6',
        }}
      >
        <div className="logo text-center p-3">
          <img src={logo} alt="logo" width={70} style={{ filter: 'invert(1)' }} />
        </div>
        <ul className="nav flex-column">
          <li className="nav-item text-center">
            <Link className="nav-link text-black-50 dash-item" to='/Dashboard'>
              <img src={dashIcon} alt="icon" width={25} />
              {!isCollapsed && 'Dashboard'}
            </Link>
          </li>
          {/* Add more nav items as needed */}
        </ul>
        <div className="mt-auto text-center">
          <Button onClick={toggleSidebar} className="m-2 bg-transparent border-0 shadow-none text-black">
            {isCollapsed ? <img src={rightarroeBtn} width={25} alt='img' /> : <img src={leftarroeBtn} width={25} alt='img' />}
          </Button>
          <br />
          <Button onClick={handleShowModal} className="m-2 border-0 bg-transparent text-black" style={{ color: 'red' }}>
            {isCollapsed ? <img src={powerIcon} width={25} alt='img' /> : 'Logout'}
          </Button>
        </div>

        {/* Logout Confirmation Modal */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header>
            <Modal.Title>Confirm Logout</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to log out?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => { handleLogout(); handleCloseModal(); }}>
              Logout
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      
    </div>
  );
};

export default Sidebar;
