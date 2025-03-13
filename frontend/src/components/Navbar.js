import React, {useRef} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doSignOut } from '../firebase/Auth';
import logoutButton from '../assets/logout.png';
import '../App.css';

function Navbar() {
    const navRef= useRef();
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await doSignOut();
        navigate('/login');
    };
    
    return (
    <header className='navbar'>
        <h2>GenArt</h2>
        <nav ref={navRef}>
            <a href="/">Home</a>
            <a href="/generate">Generate Image</a>
            <a href="/feed">Feed</a>
            {userLoggedIn ? (
                <>
                    <a href="/myprofile">My Profile</a>
                    <a className="logout" onClick={handleLogout}>
                        <img src={logoutButton} alt="logout" className='logout-button' />
                    </a>
                </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                    </>
                )}
        </nav>
    </header>
    )
}
export default Navbar;