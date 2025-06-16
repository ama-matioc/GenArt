import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../firebase/Auth';
import { useAuth } from '../contexts/AuthContext';
import '../App.css'; 
import galaxy from '../assets/galaxy.jpg';


const Login = () => {
    const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // handle email+password login
    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (error) {
                setIsSigningIn(false);
                setErrorMessage("Incorrect email or password. Please try again!");
            }
        }
    };

    //handle Google login
    const onGoogleSignIn = (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            doSignInWithGoogle().catch(() => setIsSigningIn(false));
        }
    };

    return (
        <div>
            {userLoggedIn && <Navigate to="/" replace={true} />}

            <div className="auth-container">

                <div className="auth-image">
                    <img src={galaxy} alt="galaxy" className="auth-image" />
                    <h1 className="auth-title">GenArt</h1>
                </div>

                <div className="auth-box">
                    <h3 className="title">Login to your account</h3>
                    <form onSubmit={onSubmit}>
                        {/* email input */}
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {/* password input */}
                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                            />
                        </div>

                        {errorMessage && <p className="error-message">{errorMessage}</p>}

                        {/* submit button */}
                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className={`submit-button ${isSigningIn ? 'disabled' : 'enabled'}`}
                        >
                            {isSigningIn ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* registration link */}
                    <p className="footer-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="footer-text">
                            Sign up
                        </Link>
                    </p>

                    <div className="divider">
                        <span className="divider-text">OR</span>
                    </div>

                    {/* Google login button */}
                    <button
                        disabled={isSigningIn}
                        onClick={onGoogleSignIn}
                        className="google-sign-in"
                    >
                    <svg width="30px" height="30px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
                        <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/>
                        <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/>
                        <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/>
                        <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/>
                    </svg>
                        {isSigningIn ? 'Signing In...' : 'Continue with Google'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
