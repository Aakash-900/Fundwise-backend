

// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const path = require('path');
// require('dotenv').config();

// const authRoutes = require('./routes/auth');
// const campaignRoutes = require('./routes/campaignRoutes');

// const app = express();

// // Enable CORS
// app.use(cors());

// app.use(express.json());

// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// app.use('/api/auth', authRoutes);
// app.use('/api/campaignsApi', campaignRoutes);
// app.get('/api/auth/validate-token', (req, res) => {
//   res.json({ message: 'Token validation route is active' });
// });

// // Serve static files from the React app
// app.use(express.static(path.join(__dirname, 'build')));

// // Handle React routing, return all requests to React app
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

// const PORT = process.env.PORT || 5500;

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

dotenv.config();

const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use campaign routes and handle file uploads
app.use('/api/campaigns', upload.single('image'), campaignRoutes);

app.get('/api/auth/validate-token', (req, res) => {
  res.json({ message: 'Token validation route is active' });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
