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
  passwordHistory: [{ type: String, select: false }],
  phone: { type: String },
  address: { type: String },
  nation: { type: String },
  gender: { type: String },
  dob: { type: Date },
  profileImage: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  verified: { type: Boolean, default: false },
  resetPasswordToken: { type: String, select: false }, // Hide token by default
  resetPasswordExpires: { type: Date, select: false }, // Hide expiry date by default
  failedLoginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date },
  passwordLastChanged: { type: Date, default: Date.now },
});


userSchema.methods.isAccountLocked = function() {
  return this.lockUntil && this.lockUntil > Date.now();
};

userSchema.methods.incrementFailedLoginAttempts = async function() {
  this.failedLoginAttempts += 1;
  if (this.failedLoginAttempts >= 5) {
    this.lockUntil = Date.now() + 5 * 60 * 1000; // Lock for 30 minutes
  }
  await this.save();
};

userSchema.methods.resetFailedLoginAttempts = async function() {
  this.failedLoginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

module.exports = mongoose.model('User', userSchema);
