import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMeeting } from '../services/api';

const ScheduleMeeting = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Format date and time
      const scheduledFor = new Date(`${date}T${time}`);
      
      // Create a temporary user ID (in a real app, this would come from authentication)
      const userId = localStorage.getItem('userId') || 'user-' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('userId', userId);
      
      // Save meeting to database
      await createMeeting({
        title,
        createdBy: userId,
        scheduledFor,
        isPasswordProtected,
        password: isPasswordProtected ? password : null
      });
      
      // Navigate to my meetings page
      navigate('/my-meetings');
    } catch (error) {
      console.error('Failed to schedule meeting:', error);
      alert('Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="schedule-meeting-container">
      <h2>Schedule a Meeting</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Meeting Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            required 
          />
        </div>
        
        <div className="form-group">
          <label>Time</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
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
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required={isPasswordProtected} 
            />
          </div>
        )}
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Meeting'}
        </button>
      </form>
    </div>
  );
};

export default ScheduleMeeting;