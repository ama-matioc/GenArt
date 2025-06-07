import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GenerateImage from './components/GeneratePage';
import Homepage from './components/Homepage';
import Gallery from './components/Gallery';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Img2ImgGenerator from './components/Img2ImgGenerator';
import Txt2ImgGenerator from './components/Txt2ImgGenerator';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/generate" element={<GenerateImage />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/myprofile" element={<Profile />} />
        <Route path="/img2img" element={<Img2ImgGenerator />} />
        <Route path="/txt2img" element={<Txt2ImgGenerator />} />
      </Routes>
    </Router>
  );
}

export default App;
