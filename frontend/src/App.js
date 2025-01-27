import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ImageGenerator from './components/ImageGenerator';
import Homepage from './components/Homepage';
import Feed from './components/Feed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/generate" element={<ImageGenerator />} />
        <Route path="/feed" element={<Feed />} />
      </Routes>
    </Router>
  );
}

export default App;
