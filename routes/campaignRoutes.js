const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign'); // Adjust the path as needed

// Create a campaign
router.post('/create', async (req, res) => {
  const { title, story, goal, endDate } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  if (!title || !story || !goal || !endDate || !image) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const campaign = new Campaign({ title, story, goal, endDate, image });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Fetch all campaigns
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
