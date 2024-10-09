import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ImagePage from './pages/ImagePage';
import SearchPage from './pages/SearchPage';
import Disclaimer from './pages/Disclaimer';
import Contact from './pages/Contact';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/image/:id" element={<ImagePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
