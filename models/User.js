// User.js
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   firstName: { type: String, required: true },
//   lastName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true, select: false },
//   phone: { type: String },
//   address: { type: String },
//   nation: { type: String },
//   gender: { type: String },
//   dob: { type: Date },
//   profileImage: { type: String },
//   role: { type: String, enum: ['user', 'admin'], default: 'user' },
//   resetPasswordToken: { type: String },
//   resetPasswordExpires: { type: Date }
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false }, // Password should be hidden by default
  phone: { type: String },
  address: { type: String },
  nation: { type: String },
  gender: { type: String },
  dob: { type: Date },
  profileImage: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // isVerified: { type: Boolean, default: false }, // Add this field for email/phone verification status
  resetPasswordToken: { type: String, select: false }, // Hide token by default
  resetPasswordExpires: { type: Date, select: false } // Hide expiry date by default
});

module.exports = mongoose.model('User', userSchema);
