import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageGenerator from './components/ImageGenerator';
import Homepage from './components/Homepage';
import Feed from './components/Feed';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/generate" element={<ImageGenerator />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/myprofile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
