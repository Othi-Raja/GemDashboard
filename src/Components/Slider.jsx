import React, { useState } from 'react';
import logo from './assets/AppLogo_copy-removebg.png';
import dashIcon from './assets/ic_sharp-dashboard.png';
import rightarroeBtn from './assets/right-arrows.png';
import leftarroeBtn from './assets/left-arrows.png';
import powerIcon from './assets/power.svg';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import { Button } from '@mui/material';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('Auth');
    console.log('User logged out');
    navigate('/');
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out bg-white  border-r border-gray-300 ${
          isCollapsed ? 'w-20' : 'w-56'
        } relative flex flex-col`}
      >
        <div className="flex justify-center py-5">
          <img src={logo} alt="logo" className="w-12 filter invert" />
        </div>
        <ul className="flex-grow flex flex-col items-center space-y-4">
          <li className="nav-item text-center">
            <Link className="text-gray-500 flex items-center space-x-2" to="/Dashboard">
              <img src={dashIcon} alt="icon" className="w-6" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          {/* Add more nav items as needed */}
        </ul>

        {/* Toggle Sidebar & Logout Buttons at Bottom */}
        <div className="flex flex-col items-center absolute bottom-0 w-full pb-4">
          <Button
            onClick={toggleSidebar}
            className="mb-2 bg-transparent border-0 text-gray-700 hover:bg-gray-200"
          >
            <img
              src={isCollapsed ? rightarroeBtn : leftarroeBtn}
              className="w-6"
              alt="Toggle Sidebar"
            />
          </Button>
          <Button
            onClick={handleShowModal}
            className="bg-transparent border-0 text-red-500 hover:bg-gray-200"
          >
            {isCollapsed ? (
              <img src={powerIcon} className="w-6" alt="Logout Icon" />
            ) : (
              <span>Logout</span>
            )}
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
            <Button
              variant="danger"
              onClick={() => {
                handleLogout();
                handleCloseModal();
              }}
            >
              Logout
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Sidebar;
