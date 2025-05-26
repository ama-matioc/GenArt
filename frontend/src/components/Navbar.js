import React, {useRef, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doSignOut } from '../firebase/Auth';
import logoutButton from '../assets/logout.png';
import '../App.css';

function Navbar() {
    const navRef= useRef();
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = async () => {
        await doSignOut();
        navigate('/login');
    };
    
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }
    
    const closeDropdown = (e) => {
        if (showDropdown && !e.target.closest('.dropdown')) {
            setShowDropdown(false);
        }
    }

    React.useEffect(() => {
        document.addEventListener('click', closeDropdown);
        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, [showDropdown]);

    return (
    <header className='navbar'>
        <h2>GenArt</h2>
        <nav ref={navRef}>
            <a href="/">Home</a>
            <div className="dropdown">
            <Link to="/generate" className="dropdown-toggle">
                Generate Image
            </Link>
            <div className="dropdown-menu">
                <Link to="/txt2img">Text to Image</Link>
                <Link to="/img2img">Image to Image</Link>
            </div>
            </div>
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