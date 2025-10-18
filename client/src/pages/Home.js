import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Home = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    const id = uuidv4();
    navigate(`/room/${id}`);
  };

  const joinRoom = () => {
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to VideoMeet</h1>
      <p>Connect with others through high-quality video calls</p>
      
      <div className="home-buttons">
        <button className="btn btn-primary" onClick={createRoom}>
          Create New Meeting
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/schedule')}>
          Schedule Meeting
        </button>
      </div>
      
      <div className="form-group" style={{ marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Enter Meeting ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button 
          className="btn btn-dark" 
          onClick={joinRoom}
          style={{ width: '100%', marginTop: '1rem' }}
        >
          Join Meeting
        </button>
      </div>
    </div>
  );
};

export default Home;