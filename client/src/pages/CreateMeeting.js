import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { createMeeting } from '../services/api';

const CreateMeeting = () => {
  const [title, setTitle] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Generate a unique meeting ID
      const meetingId = uuidv4();
      
      // Create a temporary user ID (in a real app, this would come from authentication)
      const userId = localStorage.getItem('userId') || 'user-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('userId', userId);
      
      // Save meeting to database
      await createMeeting({
        meetingId,
        title,
        createdBy: userId,
        isPasswordProtected,
        password: isPasswordProtected ? password : null
      });
      
      // Navigate to the room
      navigate(`/room/${meetingId}`);
    } catch (error) {
      console.error('Failed to create meeting:', error);
      alert('Failed to create meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-meeting-container">
      <h2>Create a New Meeting</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Meeting Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter meeting title"
            required
          />
        </div>
        
        <div className="form-group checkbox">
          <input
            type="checkbox"
            id="password-protected"
            checked={isPasswordProtected}
            onChange={(e) => setIsPasswordProtected(e.target.checked)}
          />
          <label htmlFor="password-protected">Password Protected</label>
        </div>
        
        {isPasswordProtected && (
          <div className="form-group">
            <label htmlFor="password">Meeting Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter meeting password"
              required={isPasswordProtected}
            />
          </div>
        )}
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Creating...' : 'Create Meeting'}
        </button>
      </form>
    </div>
  );
};

export default CreateMeeting;