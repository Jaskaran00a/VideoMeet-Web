const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const Meeting = require('../../models/Meeting');

// @route   POST api/meetings
// @desc    Create a new meeting
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { title, createdBy, scheduledFor, isPasswordProtected, password } = req.body;
    
    const meetingId = uuidv4();
    
    const newMeeting = new Meeting({
      meetingId,
      title,
      createdBy,
      scheduledFor,
      isPasswordProtected,
      password
    });
    
    const meeting = await newMeeting.save();
    
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/meetings
// @desc    Get all meetings for a user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const meetings = await Meeting.find({ createdBy: req.params.userId });
    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/meetings/:id
// @desc    Get meeting by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meetingId: req.params.id });
    
    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting not found' });
    }
    
    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/meetings/:id
// @desc    Delete a meeting
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const meeting = await Meeting.findOne({ meetingId: req.params.id });
    
    if (!meeting) {
      return res.status(404).json({ msg: 'Meeting not found' });
    }
    
    await meeting.remove();
    
    res.json({ msg: 'Meeting removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;