import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createMeeting = async (meetingData) => {
  try {
    const response = await api.post('/meetings', meetingData);
    return response.data;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

export const getUserMeetings = async (userId) => {
  try {
    const response = await api.get(`/meetings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user meetings:', error);
    throw error;
  }
};

export const getMeetingById = async (meetingId) => {
  try {
    const response = await api.get(`/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching meeting:', error);
    throw error;
  }
};

export const deleteMeeting = async (meetingId) => {
  try {
    const response = await api.delete(`/meetings/${meetingId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting meeting:', error);
    throw error;
  }
};

export default api;