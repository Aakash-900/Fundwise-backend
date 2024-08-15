
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('./middleware/authMiddleware');
const { getUserDetails, updateProfile, validateToken} = require('./controllers/authController');
const { getAllUsers, getUserById, updateUser, deleteUser } = require('./controllers/AdminuserController');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/auth');
const campaignRoutes = require('./routes/campaignRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');

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
//admin
app.use('/api/admin', userRoutes);

// Serve files securely
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const uploadsDir = path.join(__dirname, 'uploads');
  
  // Resolve the full path to the requested file
  const filePath = path.join(uploadsDir, filename);

  // Normalize the path and check if it starts with the uploads directory
  if (filePath.startsWith(uploadsDir)) {
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).json({ msg: 'File not found' });
      }
    });
  } else {
    res.status(400).json({ msg: 'Invalid file path' });
  }
});

const upload = multer({ storage: storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use campaign routes and handle file uploads
app.use('/api/campaigns', upload.single('image'), campaignRoutes);

// Use payment routesc
app.use('/api/payment', paymentRoutes);

//contactus routes
app.use('/api/contacts', contactRoutes);

//token route
app.get('/api/auth/validate-token', authMiddleware, validateToken);

// Endpoint to get user details
app.get('/api/auth/profile/:id', authMiddleware, getUserDetails);
app.put('/api/auth/update-profile', authMiddleware, updateProfile);

// Admin endpoints
app.get('/api/admin/users', authMiddleware, getAllUsers);
app.get('/api/admin/users/:id', authMiddleware, getUserById);
app.put('/api/admin/users/:id', authMiddleware, updateUser);
app.delete('/api/admin/users/:id', authMiddleware, deleteUser);



// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});



const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
