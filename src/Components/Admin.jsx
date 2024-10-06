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
import gem_logo from './assets/AppLogo_bgr.png'
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
                const docRef = doc(firestoreDb, "Admin", "onlyadmin");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const adminList = docSnap.data().AdminList;
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
                    console.log(user);
                    // Store user information in localStorage
                    localStorage.setItem('userPhotoURL', user.photoURL);
                    localStorage.setItem('userDisplayName', user.displayName);
                    localStorage.setItem('userEmail', user.email);

                    // Optional: Log the user information to the console
                    console.log('User authenticated:', user);
                    console.log('Photo URL:', user.photoURL);
                    console.log('Display Name:', user.displayName);
                    console.log('Email:', user.email);

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
                    <img src={gem_logo} alt="logo" width='160px' height='100%' className='pb-3' style={{ filter: 'invert(100%)' }} /><br />

                    {/* Google Sign-in Button */}
                    <button className="btn btn-block border-1 google-login-btn " onClick={signIn}>
                        <img src={googleicon} alt="googleIcon" />
                        <span className='mx-3 login-text '>Login With Google</span>
                    </button>
                </div>
            </div>

        </div>
    );

};
export default Admin;
