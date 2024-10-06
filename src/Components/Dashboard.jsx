import React,{useEffect ,useState} from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css'; 
import Sidebar from './Slider.jsx'; // Ensure this points to the correct Sidebar file
import { Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import  data from './UserData.json'
export default function Dashboard() {
  const [profileImage, setProfileImage] = useState();
 const [Len ,setLength] =  useState(0);
  useEffect(() => {
    if (data && typeof data === 'object') {
      const userArray = Object.values(data); // Convert object to array
      setLength(userArray.length); // Get the length of the array
    } else {
      console.error("Data is not an object:", data);
    }
    const profileImg = localStorage.getItem('userPhotoURL');
    setProfileImage(profileImg);
  }, []);
  return (
    <>
    {
      localStorage.getItem('Auth') === 'true'&& (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Left Sidebar */}
      {/* Right Content Area */}
      <Sidebar/>
      <div className="flex-fill d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
      <Nav className="navbar navbar-light border-bottom" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
          <div className="container-fluid d-flex justify-content-end">
            <img src={profileImage} alt="Profile" className="rounded-circle" width={50} />
          </div>
        </Nav>
        {/* Main Content Area */}
        <div className="content flex-grow-1 mx-5">
          {localStorage.getItem('Auth') === 'true' && (
            <div className='text-black'>
              <div className='content-card-d'>
                <div className='content-card-title text-white '>
                  All Rides
                </div>
                <Link to='/Rider' className='text-center pt-4 d-flex justify-content-center text-decoration-none'>
                  <h5 className='text-black text-decoration-none'>{Len}</h5>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
      )
    }
    </>
  );
}
