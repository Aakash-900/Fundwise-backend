// campaignController.js
const Campaign = require('../models/Campaign');

exports.createCampaign = async (req, res) => {
  try {
    const { title, story, goal, endDate, imageUrl } = req.body;
    const campaign = new Campaign({ title, story, goal, endDate, imageUrl });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign', error });
  }
};

exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns', error });
  }
};
