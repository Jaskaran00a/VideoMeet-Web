import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Room from './pages/Room';
import CreateMeeting from './pages/CreateMeeting';
import ScheduleMeeting from './pages/ScheduleMeeting';
import MyMeetings from './pages/MyMeetings';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/create" element={<CreateMeeting />} />
          <Route path="/schedule" element={<ScheduleMeeting />} />
          <Route path="/my-meetings" element={<MyMeetings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;