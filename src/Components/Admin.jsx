import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { auth, provider } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signOut } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { doc, getDoc } from 'firebase/firestore';
import { firestoreDb } from './firebaseConfig'; // Ensure correct import
import googleicon from './assets/googleicon.png'
// import gem_logo from './assets/AppLogo_bgr.png'
const info = () => {
    toast.info('😿😔Unauthorized email', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
            color: 'orange',
            fontWeight: 'bold',
            borderRadius: '20px'
        }
    });
};
const success = () => {
    toast.success('LogIn Success🎉', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        style: {
            color: 'green',
            fontWeight: "bold",
            textAlign: "center",
            borderRadius: '20px'
        }
    });
};
const Admin = () => {
    const [authState, setAuthState] = useState(false);
    const [adminEmails, setAdminEmails] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        const auth = localStorage.getItem('Auth');
        if (auth === 'true') {
            setAuthState(true);
        }
    }, []);
    useEffect(() => {
        const fetchAdminEmails = async () => {
            try {
                const docRef = doc(firestoreDb, "adminvalues", "admin");
                const docSnap = await getDoc(docRef);
                // console.log(docSnap);
                
                if (docSnap.exists()) {
                    const adminList = docSnap.data().admins;
                    setAdminEmails(adminList);
                    // console.log("AdminList:", adminList);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching admin emails: ", error);
            }
        };
        fetchAdminEmails();
    }, []);
    function signIn() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                // Check if the user's email is in the list of admin emails
                if (adminEmails.includes(user.email)) {
                    success();
                    setAuthState(true);
                    localStorage.setItem('Auth', 'true');
                    // console.log(user);
                    // // Store user information in localStorage
                    // localStorage.setItem('userPhotoURL', user.photoURL);
                    // localStorage.setItem('userDisplayName', user.displayName);
                    // localStorage.setItem('userEmail', user.email);

                    // Optional: Log the user information to the console
                    // console.log('User authenticated:', user);
                    // console.log('Photo URL:', user.photoURL);
                    // console.log('Display Name:', user.displayName);
                    // console.log('Email:', user.email);

        // Redirect to /Dashboard
        navigate('/Dashboard'); // Redirect to Dashboard

                    //   window.location.reload();
                } else {
                    info();
                    signOut(auth);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    if (authState) {
        const card = document.querySelector('.card');
        if (card) {
            card.classList.add('hidden');
        }
    }
    return (
        <div className='login-card-position  '>

            <div className=" text-center  " >
                <div className=" mx-3">
                    {/* Logo */}
                    {/* <img src={gem_logo} alt="logo" width='160px' height='100%' className='pb-3' style={{ filter: 'invert(100%)' }} /><br /> */}

                    {/* Google Sign-in Button */}
                    {/* <button className="btn btn-block border-1 google-login-btn ">
                        <img src={googleicon} alt="googleIcon" width={40} />
                        <h5 className='mx-3 login-text '>Login With Google</h5>
                    </button> */}
                    <div className="flex items-center justify-center min-h-screen">
            <button  onClick={signIn} className=" border-0 shadow-none flex items-center bg-white dark:bg-gray-900 border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 dark:text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                <svg 
                    className="h-6 w-6 mr-2" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="-0.5 0 48 48"
                >
                    <g fill="none" fillRule="evenodd">
                        <path d="M9.827,24C9.827,22.476 10.08,21.014 10.532,19.644L2.623,13.604C1.082,16.734 0.214,20.26 0.214,24C0.214,27.737 1.081,31.261 2.62,34.388L10.525,28.337C10.077,26.973 9.827,25.517 9.827,24" fill="#FBBC05"/>
                        <path d="M23.714,10.133C27.025,10.133 30.016,11.307 32.366,13.227L39.202,6.4C35.036,2.773 29.695,0.533 23.714,0.533C14.427,0.533 6.445,5.844 2.623,13.604L10.532,19.644C12.355,14.112 17.549,10.133 23.714,10.133" fill="#EB4335"/>
                        <path d="M23.714,37.867C17.549,37.867 12.355,33.888 10.532,28.356L2.623,34.395C6.445,42.156 14.427,47.467 23.714,47.467C29.446,47.467 34.918,45.431 39.025,41.618L31.518,35.814C29.4,37.149 26.732,37.867 23.714,37.867" fill="#34A853"/>
                        <path d="M46.145,24C46.145,22.613 45.932,21.12 45.611,19.733L23.714,19.733V28.8H36.318C35.688,31.891 33.972,34.268 31.518,35.814L39.025,41.618C43.339,37.614 46.145,31.649 46.145,24" fill="#4285F4"/>
                    </g>
                </svg>
                <span>Continue with Google</span>
            </button>
        </div>
                </div>
            </div>

        </div>
    );

};
export default Admin;
