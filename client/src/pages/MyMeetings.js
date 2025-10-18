import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserMeetings, deleteMeeting } from '../services/api';

const MyMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        // Get user ID from localStorage (in a real app, this would come from authentication)
        const userId = localStorage.getItem('userId');
        
        if (!userId) {
          setMeetings([]);
          setLoading(false);
          return;
        }
        
        const userMeetings = await getUserMeetings(userId);
        setMeetings(userMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
        setError('Failed to load meetings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeetings();
  }, []);
  
  const handleJoinMeeting = (meetingId) => {
    navigate(`/room/${meetingId}`);
  };
  
  const handleCancelMeeting = async (meetingId) => {
    try {
      await deleteMeeting(meetingId);
      setMeetings(meetings.filter(meeting => meeting.meetingId !== meetingId));
    } catch (error) {
      console.error('Error canceling meeting:', error);
      alert('Failed to cancel meeting. Please try again.');
    }
  };
  
  if (loading) return <div className="loading">Loading your meetings...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="my-meetings-container">
      <h2>My Scheduled Meetings</h2>
      
      {meetings.length === 0 ? (
        <p>You don't have any scheduled meetings.</p>
      ) : (
        <div className="meetings-list">
          {meetings.map(meeting => (
            <div key={meeting.meetingId} className="meeting-card">
              <div className="meeting-info">
                <h3>{meeting.title}</h3>
                <p>Date: {new Date(meeting.scheduledFor).toLocaleDateString()}</p>
                <p>Time: {new Date(meeting.scheduledFor).toLocaleTimeString()}</p>
                <p>
                  {meeting.isPasswordProtected ? 
                    '🔒 Password Protected' : 
                    '🔓 No Password Required'}
                </p>
              </div>
              <div className="meeting-actions">
                <button 
                  className="btn join-btn"
                  onClick={() => handleJoinMeeting(meeting.meetingId)}
                >
                  Join
                </button>
                <button 
                  className="btn cancel-btn"
                  onClick={() => handleCancelMeeting(meeting.meetingId)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMeetings;