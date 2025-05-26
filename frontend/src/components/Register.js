import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { doCreateUserWithEmailAndPassword } from '../firebase/Auth'
import galaxy from '../assets/galaxy.jpg'

const Register = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isRegistering) {
            setIsRegistering(true)
            await doCreateUserWithEmailAndPassword(email, password, username)
        }
    }

    return (
        <div>
            {userLoggedIn && (<Navigate to={'/generate'} replace={true} />)}


                <div className="auth-container">
                    
                        <div className="auth-image">
                            <img src={galaxy} alt="galaxy" className="auth-image" />
                            <h1 className="auth-title">GenArt</h1>
                        </div>

                <div className="auth-box">
                    <h3 className="title">Create a new account</h3>
                    <form onSubmit={onSubmit}>
                        <div className="input-group">
                            <label className="input-label">Username</label>  
                            <input
                                type="text"
                                required
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                className="input-field"
                            />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                autoComplete='email'
                                required
                                value={email} onChange={(e) => { setEmail(e.target.value) }}
                                className="input-field"
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='new-password'
                                required
                                value={password} onChange={(e) => { setPassword(e.target.value) }}
                                className="input-field"
                            />
                        </div>

                        <div className='input-group'>
                            <label className="input-label">Confirm Password</label>
                            <input
                                disabled={isRegistering}
                                type="password"
                                autoComplete='off'
                                required
                                value={confirmPassword} onChange={(e) => { setconfirmPassword(e.target.value) }}
                                className="input-field"
                            />
                        </div>

                        {errorMessage && (
                            <span className='error-message'>{errorMessage}</span>
                        )}

                        <button
                            type="submit"
                            disabled={isRegistering}
                            className={`submit-button ${isRegistering ? 'disabled' : 'enabled'}`}
                        >
                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                        </button>
                        <div className="footer-text">
                            Already have an account? {'   '}
                            <Link to={'/login'} className="footer-text">Login</Link>
                        </div>
                    </form>
                </div>
                </div>
                </div>
    );
};

export default Register;