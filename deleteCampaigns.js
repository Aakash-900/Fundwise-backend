const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const Campaign = require('./models/Campaign'); // Adjust the path to your Campaign model

// Connect to the MongoDB database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Function to delete all campaigns and their images
const deleteAllCampaignsAndImages = async () => {
  try {
    // Find and delete all campaigns
    const campaigns = await Campaign.find();
    for (let campaign of campaigns) {
      // Delete the campaign from the database
      await Campaign.findByIdAndDelete(campaign._id);
      console.log(`Deleted campaign with ID: ${campaign._id} and title: ${campaign.title}`);

      // Delete the corresponding image file
      if (campaign.image) {
        const imagePath = path.join(__dirname, 'uploads', campaign.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting image file: ${imagePath}`, err);
          } else {
            console.log(`Deleted image file: ${imagePath}`);
          }
        });
      }
    }
    console.log('Deleted all campaigns and their images from the database');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting campaigns and images:', error);
    process.exit(1);
  }
};

// Execute the function
deleteAllCampaignsAndImages();
