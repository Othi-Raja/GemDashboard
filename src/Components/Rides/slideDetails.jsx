import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaWhatsapp, FaPhone, FaPen } from 'react-icons/fa';
import { IoMdCheckmark } from 'react-icons/io';
import { LiaTimesSolid } from 'react-icons/lia';
import { CiCreditCard1 } from 'react-icons/ci';
import { RiMotorbikeFill } from 'react-icons/ri';
import { FaLocationDot } from 'react-icons/fa6';
import { Row, Col, Container } from 'react-bootstrap';
import notfound from '../assets/dummy_rec.png';
import '../App.css';
import { TextField, Button } from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { firestoreDb } from '../firebaseConfig'; // Import your Firestore configuration
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
export default function UserDetailsSlider({ ride, onClose }) {
    const sliderRef = useRef(null);
    const [odoReading1, setOdoReading1] = useState('');
    const [odoReading2, setOdoReading2] = useState('');
    const [odoDifference, setOdoDifference] = useState(null);
    const [confirmOdoUpdate, setConfirmOdoUpdate] = useState(false); // Checkbox state
    useEffect(() => {
        document.body.classList.add('active');
        const handleClickOutside = (event) => {
            if (sliderRef.current && !sliderRef.current.contains(event.target)) {
                onClose(); // Close the slider if clicked outside
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.body.classList.remove('active');
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    useEffect(() => {
        if (odoReading1 && odoReading2) {
            setOdoDifference(Math.abs(odoReading1 - odoReading2));
        } else {
            setOdoDifference(null);
        }
    }, [odoReading1, odoReading2]);
    // Handle odometer update if the checkbox is checked
    useEffect(() => {
        const updateDistance = async () => {
            if (confirmOdoUpdate) {
                try {
                    await updateDoc(doc(firestoreDb, `users/${ride.userID}/rides`, ride.id), {
                        distance: odoDifference, // Update the distance in Firestore
                    });
                    // Optionally show a success message or do something else
                    console.log('Distance updated successfully');
                } catch (error) {
                    console.error('Error updating distance: ', error);
                }
            }
        };
        updateDistance();
    }, [odoDifference,confirmOdoUpdate]); // Runs when confirmOdoUpdate changes
    
    // Function to update Firestore with "No Coin" values
    const handleNoCoin = async () => {
        try {
            await updateDoc(doc(firestoreDb, `users/${ride.userID}/rides`, ride.id), {
                status: 'approved',
                rideverf: 'rejected'
            });
            console.log('No Coin status updated successfully');
        } catch (error) {
            console.error('Error updating No Coin status: ', error);
        }
    };
    // Function to update Firestore with "Less Coin" values
    const handleLessCoin = async () => {
        try {
            await updateDoc(doc(firestoreDb, `users/${ride.userID}/rides`, ride.id), {
                status: 'approved',
                rideverf: 'unverified'
            });
            console.log('Less Coin status updated successfully');
        } catch (error) {
            console.error('Error updating Less Coin status: ', error);
        }
    };
    // Function to update Firestore with "Full Coin" values
    const handleFullCoin = async () => {
        try {
            await updateDoc(doc(firestoreDb, `users/${ride.userID}/rides`, ride.id), {
                status: 'approved',
                rideverf: 'verified'
            });
            console.log('Full Coin status updated successfully');
        } catch (error) {
            console.error('Error updating Full Coin status: ', error);
        }
    };
    return (
        <Container ref={sliderRef} className={`slide-in ${ride ? 'active' : ''} d-flex flex-column shadow z-40`}>
            <button onClick={onClose} className="btn mb-3 outline-none shadow-none border-none pt-3 w-auto">
                <FaTimes />
            </button>
            {ride && (
                <>
                    {/* Main Content */}
                    <div className="flex-grow-1 overflow-hidden">
                        {/* Top Section */}
                        <Row className="d-flex align-items-center mb-3 px-7 overflow-hidden">
                            <Col className="d-flex align-items-start">
                                <img
                                    src={ride.image || notfound}
                                    alt="User"
                                    className="rounded-circle"
                                    style={{ width: '60px', marginRight: '10px', height: '60px' }}
                                />
                                <div>
                                    <h5 style={{ margin: '0' }}>{ride.userName}</h5>
                                    <span style={{ fontSize: '0.6rem' }}>{formatTimestamp(ride.startTime)}</span>
                                </div>
                            </Col>
                            <Col className="d-flex gap-3 justify-content-end">
                                <a className="text-black" href={`https://wa.me/${ride.number}`}>
                                    <FaWhatsapp />
                                </a>
                                <a className="text-black" href={`tel:${ride.number}`}>
                                    <FaPhone style={{ transform: 'scaleX(-1)' }} />
                                </a>
                                <FaPen />
                            </Col>
                        </Row>
                        {/* Verification Details */}
                        <Row className="d-flex gap-3 mb-3 text-center px-7 overflow-hidden">
                            <Col className="d-flex">
                                <span className="d-flex">
                                    <CiCreditCard1 size={20} />
                                    {ride.drivinglicense ? (
                                        <IoMdCheckmark className="mx-2" color="#22DD22" />
                                    ) : (
                                        <LiaTimesSolid className="mx-2" color="red" />
                                    )}
                                </span>
                            </Col>
                            <Col className="d-flex">
                                <span className="d-flex">
                                    <RiMotorbikeFill size={20} />
                                    {ride.vehicleverification === 'verified' ? (
                                        <IoMdCheckmark className="mx-2" color="#22DD22" />
                                    ) : (
                                        <LiaTimesSolid color="red" className="mx-2" />
                                    )}
                                </span>
                            </Col>
                            <Col className="d-flex">
                                <FaLocationDot size={20} /> <span className="text-black-50 mx-2">{Math.round(ride.distance)} Km</span>
                            </Col>
                        </Row>
                        {/* Bike Details */}
                        <Row className="d-flex justify-content-center align-items-center mb-3 text-center px-7 overflow-hidden">
                            <Col xs="auto" className="d-flex justify-content-center align-items-center">
                                <img
                                    src={ride.vehiclebrandlogo || notfound}
                                    style={{ width: '70px', borderRadius: '8px' }}
                                    alt="Vehicle Brand Logo"
                                />
                            </Col>
                            <Col xs="auto" className="d-flex flex-column align-items-center text-center">
                                <div>
                                    <span style={{ fontSize: '16px', fontWeight: '600', display: 'block' }}>
                                        {ride.vehicleregno}
                                    </span>
                                    <span style={{ fontSize: '12px', fontWeight: '600', display: 'block' }}>
                                        {ride.vehiclebrand}
                                    </span>
                                    <span style={{ fontSize: '12px', fontWeight: '400', display: 'block' }}>
                                        {ride.vehiclemodel}
                                    </span>
                                </div>
                            </Col>
                            <Col xs="auto" className="d-flex justify-content-center align-items-center">
                                <FaPen style={{ cursor: 'pointer' }} />
                            </Col>
                        </Row>
                        {/* Odometer Images */}
                        <Row className=" overflow-hidden">
                            <Col className='text-center'>
                                <h6>Pre ride odo</h6>
                                {ride.prepostride?.[0] ? (
                                    <center>

                                        <img src={ride.prepostride[0]} alt="Pre-ride Odometer" className='OdoMeterImg ' style={{ width: '198px', borderRadius: '8px', objectFit: 'cover' }} />
                                    </center>
                                ) : (
                                    <span>Skipped</span>
                                )}
                            </Col>
                            <Col className='text-center '>
                                <h6>Post ride odo</h6>
                                {ride.prepostride?.[1] ? (
                                    <center>

                                        <img src={ride.prepostride[1]} alt="Post-ride Odometer" style={{ width: '198px', borderRadius: '8px' }} />
                                    </center>
                                ) : (
                                    <span>Skipped</span>
                                )}
                            </Col>
                        </Row>
                    </div>
                    {/* Footer */}
                    <footer className="mt-auto  border-top">
                        <Row className="d-flex justify-content-center mt-3">
                            <Col className="text-center">
                                <TextField
                                    placeholder="Odometer Reading 1"
                                    type="number"
                                    variant="outlined"
                                    className='odoMeter'
                                    size="small"
                                    value={odoReading1}
                                    onChange={(e) => setOdoReading1(Number(e.target.value))}
                                />
                            </Col>
                            {odoDifference !== null && (
                                <Col className="text-center d-flex align-items-center justify-content-center">
                                    <h5 className='text-center'>{`Odometer Difference: ${odoDifference}`}</h5>
                                </Col>
                            )}
                            <Col className="text-center">
                                <TextField
                                    placeholder="Odometer Reading 2"
                                    type="number"
                                    variant="outlined"
                                    className='odoMeter'
                                    size="small"
                                    value={odoReading2}
                                    onChange={(e) => setOdoReading2(Number(e.target.value))}
                                />
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-center mt-3">
                            <Col className="text-center">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={confirmOdoUpdate}
                                        onChange={() => setConfirmOdoUpdate((prev) => !prev)}
                                    />
                                    Confirm Distance Update
                                </label>
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-center">
                            <Col className="text-center">
                                <Button variant="contained" className="px-4" size="small" style={{ background: 'red' }} onClick={handleNoCoin}>
                                    No Coin
                                </Button>
                            </Col>
                            <Col className="text-center">
                                <Button variant="contained" className="px-4" size="small" style={{ background: 'black' }} onClick={handleLessCoin}>
                                    Less Coin
                                </Button>
                            </Col>
                            <Col className="text-center">
                                <Button variant="contained" className="px-4" size="small" style={{ background: 'green' }} onClick={handleFullCoin}>
                                    Full Coin
                                </Button>
                            </Col>
                        </Row>
                        <Row className="d-flex justify-content-center">
                            <Button variant="contained" className="mt-4" size='small' style={{ background: 'green' }}>Add Notes</Button>
                        </Row>
                    </footer>
                </>
            )}
        </Container>
    );
}
