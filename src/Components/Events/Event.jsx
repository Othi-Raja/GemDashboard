import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { collection, doc, getDoc, getDocs, addDoc, arrayUnion } from 'firebase/firestore';
import { firestoreDb } from '../firebaseConfig';
import { Container } from 'react-bootstrap';
import { Col, Row } from 'react-bootstrap';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import './event.css'
export default function Event() {
  // ----------------------------------------sider 
  const [newUrl, setNewUrl] = useState(''); // State to track the new URL input
  // Function to handle adding a new URL
  const handleAddUrl = () => {
    if (newUrl.trim() !== '') {
      setNewEvent((prevState) => ({
        ...prevState,
        urlList: [...prevState.urlList, newUrl]
      }));
      setNewUrl(''); // Clear the input field after adding
    }
  };
  // Function to handle deleting a URL from the list
  const handleDeleteUrl = (index) => {
    setNewEvent((prevState) => ({
      ...prevState,
      urlList: prevState.urlList.filter((_, i) => i !== index)
    }));
  };
  // --------------------------------------------

  // ----------------------------------------tickets 
  // Handle adding a new ticket
  const handleAddTicket = () => {
    setNewEvent(prevState => ({
      ...prevState,
      tickets: [
        ...prevState.tickets,
        {
          earnGEMcoins: { maxCoinsEarned: '', minCoinsEarned: '', text: '' },
          endDate: '',
          interested: [],
          prizepool: '',
          redeemGEMcoins: { desc: '', discount: '' },
          regFee: '',
          slots: '',
          startDate: '',
          ticketDescription: '',
          ticketName: ''
        }
      ]
    }));
  };
  // Handle removing a ticket
  const handleRemoveTicket = index => {
    const updatedTickets = [...newEvent.tickets];
    updatedTickets.splice(index, 1); // Remove ticket at the specified index
    setNewEvent({ ...newEvent, tickets: updatedTickets });
  };
  // Handle changing ticket values
  const handleTicketChange = (index, field, value, nestedField = null) => {
    const updatedTickets = [...newEvent.tickets];
    if (nestedField) {
      // If updating a nested field like 'redeemGEMcoins'
      updatedTickets[index][field] = {
        ...updatedTickets[index][field], // Spread the existing object
        [nestedField]: value             // Update the specific nested field
      };
    } else {
      updatedTickets[index][field] = value; // Update regular fields
    }
    setNewEvent({ ...newEvent, tickets: updatedTickets });
  };
  // ---------------------------------------tickets 

  const [newEvent, setNewEvent] = useState({
    buttonName: '',
    ticketName: '',
    ticketDescription: '',
    regFee: '',
    slots: '',
    totalPrizepool: '',
    eventTitle: '',
    posterImage: '',
    launchTD: '',
    urlList: [],
    startTD: '',
    endTD: '',
    paymentMode: '',
    eventDoc: '',
    eventGeoPoint: { latitude: '', longitude: '' },
    isPinned: '',
    radius: '',
    eventLocation: '',
    sponsors: [  // Add sponsors array with an empty sponsor object
      { image: '', name: '', url: '' }
    ],
    host: {
      name: '',
      image: '',
      url: ''
    },
    tickets: [
      {
        earnGEMcoins: {
          maxCoinsEarned: '',
          minCoinsEarned: '',
          text: ''
        },
        endDate: '',
        interested: [],
        prizepool: '',
        redeemGEMcoins: {
          desc: '',
          discount: ''
        },
        regFee: '',
        slots: '',
        startDate: '',
        ticketDescription: '',
        ticketName: ''
      }
    ]
  });
  // Handle input change for a new event
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('host')) {
      const hostKey = name.split('.')[1];
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        host: {
          ...prevEvent.host,
          [hostKey]: value,
        },
      }));
    } else if (name === 'latitude' || name === 'longitude') {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        eventGeoPoint: {
          ...prevEvent.eventGeoPoint,
          [name]: value,
        },
      }));
    } else {
      setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
    }
  };
  // Handle input change for a new ticket sponsor
  const handleInputChangeS = (index, field, value) => {
    const updatedSponsors = newEvent.sponsors.map((sponsor, i) =>
      i === index ? { ...sponsor, [field]: value } : sponsor
    );
    setNewEvent(prevState => ({
      ...prevState,
      sponsors: updatedSponsors
    }));
  };
  const addSponsor = () => {
    setNewEvent(prevState => ({
      ...prevState,
      sponsors: [...prevState.sponsors, { image: '', name: '', url: '' }]
    }));
  };
  const removeSponsor = (index) => {
    const updatedSponsors = newEvent.sponsors.filter((_, i) => i !== index);
    setNewEvent(prevState => ({
      ...prevState,
      sponsors: updatedSponsors
    }));
  };
  // -----------------------------------------------
  // Save new event to Firestore
  const handleCreateNewEvent = async () => {
    try {
      const eventsCollectionRef = collection(firestoreDb, 'homescreen', 'promotionContent', 'event4');
      await addDoc(eventsCollectionRef, newEvent);
      // Clear form after save
      setNewEvent({
        buttonName: '',
        ticketName: '',
        ticketDescription: '',
        regFee: '',
        slots: '',
        totalPrizepool: '',
        urlList: [],
        eventTitle: '',
        posterImage: '',
        launchTD: '',
        startTD: '',
        endTD: '',
        paymentMode: '',
        eventDoc: '',
        eventGeoPoint: { latitude: '', longitude: '' },
        isPinned: '',
        radius: '',
        eventLocation: '',
        sponsors: [  // Add sponsors array with an empty sponsor object
          { image: '', name: '', url: '' }
        ],
        host: {
          name: '',
          image: '',
          url: ''
        },
        tickets: [
          {
            earnGEMcoins: { maxCoinsEarned: '', minCoinsEarned: '', text: '' },
            endDate: '',
            interested: [],
            prizepool: '',
            redeemGEMcoins: { desc: '', discount: '' },
            regFee: '',
            slots: '',
            startDate: '',
            ticketDescription: '',
            ticketName: ''
          }
        ]
      });
    } catch (error) {
      console.error('Error creating new event:', error);
    }
  };

  const [contests, setContests] = useState([]); // State to store subcollection data
  // Fetch data from Firestore
  const fetchData = async () => {
    try {
      const docRef = doc(firestoreDb, 'homescreen', 'promotionContent');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const contestsRef = collection(firestoreDb, 'homescreen', 'promotionContent', 'event1');
        const contestsSnap = await getDocs(contestsRef);
        const contestsData = contestsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setContests(contestsData);
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  // Handle input change for a specific contest
  // const handleInputChange = (e, index) => {
  //   const { name, value } = e.target;
  //   const updatedContests = contests.map((contest, i) =>
  //     i === index ? { ...contest, [name]: value } : contest
  //   );
  //   setContests(updatedContests);
  // };
  // Save changes to Firestore for a specific contest
  // const handleSaveChanges = async (contest) => {
  //   try {
  //     const contestDocRef = doc(firestoreDb, 'homescreen', 'promotionContent', 'contests', contest.id);
  //     await updateDoc(contestDocRef, contest);
  //     fetchData(); // Re-fetch data to reflect changes
  //   } catch (error) {
  //     console.error('Error updating contest:', error);
  //   }
  // };
  return (
    <div>
      <Container className='pt-5'>
        {/* New Event Form */}
        <Row>
          <Col>
            <TextField
              fullWidth
              label="Ticket Name"
              name="ticketName"
              value={newEvent.ticketName}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="Ticket Description"
              name="ticketDescription"
              value={newEvent.ticketDescription}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="Registration Fee"
              type="number"
              name="regFee"
              value={newEvent.regFee}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <TextField
              fullWidth
              label="Payment Mode"
              type="text"
              name="paymentMode"
              value={newEvent.paymentMode}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="Button Name"
              type="text"
              name="buttonName" // Change this to remove the space
              value={newEvent.buttonName}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="eventDoc"
              type="text"
              name="eventDoc"
              value={newEvent.eventDoc}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <TextField
              label="Slots"
              fullWidth
              name="slots"
              value={newEvent.slots}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="Total Prizepool"
              type="number"
              name="totalPrizepool"
              value={newEvent.totalPrizepool}
              onChange={handleInputChange}
              className="mb-3 remove-spin-button"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="Event Title"
              name="eventTitle"
              type='text'
              value={newEvent.eventTitle}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
        </Row>
        <Row>
          <label className='pb-4 fw-bolder fs-6'> Event Location</label>
          <Col>
            <TextField
              fullWidth
              label="Latitude"
              name="latitude"
              type='number'
              value={newEvent.eventGeoPoint.latitude || ''}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="Longitude"
              name="longitude"
              type='number'
              value={newEvent.eventGeoPoint.longitude || ''}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="Is Pinned"
              name="isPinned"
              value={newEvent.isPinned || ''}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Row>
            <Col>
              <TextField
                label="Radius"
                name="radius"
                type='number'
                fullWidth
                value={newEvent.radius || ''}
                onChange={handleInputChange}
                className="mb-3"
              />
            </Col>
            <Col>
              <TextField
                label="Event Location"
                name="eventLocation"
                fullWidth
                value={newEvent.eventLocation || ''}
                onChange={handleInputChange}
                className="mb-3"
              />
            </Col>
          </Row>
        </Row>
        {/* Event Banner */}
        <Row className='custm-border p-2 mb-3'>
          <label htmlFor="Poster Image" className='fw-bolder h4'>Banner Preview</label>
          <Col className='pb-4'>
            <img src={newEvent.posterImage} alt="banner" style={{ width: 'auto', height: '250px', display: newEvent.posterImage.length  > 0 ? 'block' : 'none' }} />

          </Col>
          <TextField
            label="Poster Image"
            name="posterImage"
            value={newEvent.posterImage}
            onChange={handleInputChange}
            className="mb-3"
          />
        </Row>
        {/* Event Date/Time */}
        <Row>
          <label className='pb-4 fw-bolder'>Event Date/Time</label>
          <Col>
            <label>LaunchTD</label><br />
            <TextField
              type="datetime-local"
              name="launchTD"
              value={newEvent.launchTD}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <label>Start Date</label><br />
            <TextField
              type="datetime-local"
              name="startTD"
              value={newEvent.startTD}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <label>EndTD</label><br />
            <TextField
              type="datetime-local"
              name="endTD"
              value={newEvent.endTD}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
        </Row>
        {/* Host */}
        <Row>
          <label className='pb-4 fw-bolder fs-6'>Host</label>
          <Col>
            <TextField
              label="Host Name"
              name="host.name"
              fullWidth
              value={newEvent.host.name}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="Host Image"
              name="host.image"
              value={newEvent.host.image}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
          <Col>
            <TextField
              fullWidth
              label="Host Url"
              name="host.url"
              value={newEvent.host.url}
              onChange={handleInputChange}
              className="mb-3"
            />
          </Col>
        </Row>
        <Row className="mt-3">
          <label className='fw-bolder h4'>Slider List</label>
          <Col>
            {/* Input for new URL */}
            <TextField
              fullWidth
              label="Add New Slider URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddUrl(); // Add URL on Enter key press
                }
              }}
              className="mb-2"
            />
            <Button variant="contained" color="primary" onClick={handleAddUrl}>
              Add URL
            </Button>
            {/* Displaying the list of URLs */}
            <ul>
              {newEvent.urlList.map((url, index) => (
                <li key={index}>
                  {url}
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteUrl(index)}
                    size="small"
                    color="secondary"
                  >
                    <DeleteIcon />
                  </IconButton>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
        {/* Sponsors Section */}
        <Row className='custm-border p-2 mb-3'>
          <label className='fw-bolder h4'>Sponsors</label>
          {newEvent.sponsors && newEvent.sponsors.length > 0 ? (
            newEvent.sponsors.map((sponsor, index) => (
              <Row key={index} className='mb-3'>
                <Col>
                  <TextField
                    fullWidth
                    label="Sponsor Image"
                    value={sponsor.image}
                    onChange={(e) => handleInputChangeS(index, 'image', e.target.value)}
                    className="mb-3"
                  />
                </Col>
                <Col>
                  <TextField
                    fullWidth
                    label="Sponsor Name"
                    value={sponsor.name}
                    onChange={(e) => handleInputChangeS(index, 'name', e.target.value)}
                    className="mb-3"
                  />
                </Col>
                <Col>
                  <TextField
                    fullWidth
                    label="Sponsor URL"
                    value={sponsor.url}
                    onChange={(e) => handleInputChangeS(index, 'url', e.target.value)}
                    className="mb-3"
                  />
                </Col>
                <Col className="d-flex align-items-center">
                  <IconButton className='px-3' onClick={() => removeSponsor(index)} aria-label="delete" size="small">
                    <DeleteIcon />
                  </IconButton>
                  <Button variant="outlined" color="primary" onClick={addSponsor}>
                    <b className='fs-5'> +</b>
                  </Button>
                </Col>
              </Row>
            ))
          ) : (
            <p>No sponsors added yet.</p>
          )}
        </Row>
        <Row>
          <span className='fs-5 font-bold mt-10 mb-4'>Create New Event Tickets</span>
           
          {newEvent.tickets.map((ticket, index) => (
            <div key={index}>
              <Row>
                <Col>
                  <TextField
                    label="Ticket Name"
                    className=' mb-3'
                    value={ticket.ticketName}
                    onChange={(e) => handleTicketChange(index, 'ticketName', e.target.value)}
                    fullWidth
                  />
                </Col>
                <Col>
                  <TextField
                    label="Ticket Description"
                        className=' mb-3'
                    value={ticket.ticketDescription}
                    onChange={(e) => handleTicketChange(index, 'ticketDescription', e.target.value)}
                    fullWidth
                  />
                </Col>
                <Col>
                  <TextField
                    label="Registration Fee"
                        className=' mb-3'
                    value={ticket.regFee}
                    onChange={(e) => handleTicketChange(index, 'regFee', e.target.value)}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <TextField
                    label="Slots"
                        className=' mb-3'
                    value={ticket.slots}
                    onChange={(e) => handleTicketChange(index, 'slots', e.target.value)}
                    fullWidth
                  />
                </Col>
                <Col>
                  <TextField
                    value={ticket.startDate}
                    type="datetime-local"
                        className=' mb-3'
                    onChange={(e) => handleTicketChange(index, 'startDate', e.target.value)}
                    fullWidth
                  />
                </Col>
                <Col>
                  <TextField
                    type="datetime-local"
                        className=' mb-3'
                    value={ticket.endDate}
                    onChange={(e) => handleTicketChange(index, 'endDate', e.target.value)}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <TextField
                    label="Prize Pool"
                    value={ticket.prizepool}
                    onChange={(e) => handleTicketChange(index, 'prizepool', e.target.value)}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <label className=' fs-5 fw-bolder mt-10 mb-4'>Earn GEM Coins</label>
                <Col>
                  <TextField
                    label="Earn GEM Coins Max"
                    type='text'
                    value={ticket.earnGEMcoins.maxCoinsEarned }
                    onChange={(e) => handleTicketChange(index, 'earnGEMcoins', e.target.value,'maxCoinsEarned')}
                    fullWidth
                  />
                </Col>
                <Col>
                  <TextField
                    label="Earn GEM Coins Min"
                    value={ticket.earnGEMcoins.minCoinsEarned}
                    onChange={(e) => handleTicketChange(index, 'earnGEMcoins', e.target.value,'minCoinsEarned')}
                    fullWidth
                  />
                </Col>
                <Col>
                  <TextField
                    label="Earn GEM Coins Text"
                    type='text'
                    value={ticket.earnGEMcoins.text}
                    onChange={(e) => handleTicketChange(index, 'earnGEMcoins', e.target.value,'text')}
                    fullWidth
                  />
                </Col>
              </Row>
              <Row>
                <label className=' fs-5 fw-bolder mt-10 mb-4'>Redeem GEM Coins</label>
                <Col>
                  <TextField
                    label="Earn GEM Coins Max"
                    value={ticket.redeemGEMcoins.desc}
                    onChange={(e) => handleTicketChange(index, 'redeemGEMcoins', e.target.value,'desc')}
                    fullWidth
                  />
                </Col>
                <Col>
                  <TextField
                    label="Earn GEM Coins Min"
                    value={ticket.redeemGEMcoins.discount}
                    onChange={(e) => handleTicketChange(index, 'redeemGEMcoins', e.target.value,'discount')}
                    fullWidth
                  />
                </Col>
              </Row>
              
              <IconButton
                aria-label="delete ticket"
                onClick={() => handleRemoveTicket(index)}
                size="small"
                color="secondary"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
         <Col>
         <Button variant="contained" color="primary" onClick={handleAddTicket}>
            Add Ticket
          </Button>
          </Col>
        </Row>
        {/* Sticky Save Button for creating a new event */}
        <div style={{ textAlign: 'right' }} className='sticky-bottom mb-5'>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateNewEvent}
          >
            Create New Event
          </Button>
        </div>
      </Container>
    </div>
  );
}
