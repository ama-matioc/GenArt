import React, {useRef} from 'react';
import '../App.css';

function Navbar() {
    const navRef= useRef();
    return (
    <header className='navbar'>
        <h2>GenArt</h2>
        <nav ref={navRef}>
            <a href="/">Home</a>
            <a href="/generate">Generate Image</a>
            <a href="/feed">Feed</a>
        </nav>
    </header>
    )
}
export default Navbar;