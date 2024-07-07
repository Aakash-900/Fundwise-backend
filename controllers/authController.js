// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');

// // Configure Nodemailer with Gmail credentials
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// exports.signup = async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   try {
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     user = new User({
//       firstName,
//       lastName,
//       email,
//       password: await bcrypt.hash(password, 10)
//     });

//     await user.save();

//     const payload = { userId: user.id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.status(201).json({ token });
//   } catch (err) {
//     console.error('Signup error:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const payload = { userId: user.id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Fetch user details and explicitly include the password for authentication check
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Ensure password is not included in the response
//     user.password = undefined;

//     const payload = { userId: user.id };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

//     // Return both the token and the user details, excluding the password
//     res.json({
//       token,
//       user: {
//         id: user._id,
//         firstName: user.firstName,
//         lastName: user.lastName,
//         email: user.email
//       }
//     });
//   } catch (err) {
//     console.error('Login error:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// exports.validateToken = (req, res) => {
//   const token = req.headers['authorization']?.split(' ')[1]; // Bearer Token
//   if (!token) {
//     return res.status(401).json({ msg: 'No token provided' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     res.status(200).json({ valid: true, userId: decoded.userId });
//   } catch (error) {
//     res.status(401).json({ valid: false, msg: 'Token is invalid' });
//   }
// };

// exports.forgetPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ msg: 'No user found with that email' });
//     }

//     const token = crypto.randomBytes(20).toString('hex');

//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: 'Fundwise Password Reset',
//       text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
//         Please click on the following link, or paste this into your browser to complete the process:\n\n
//         http://${req.headers.host}/reset/${token}\n\n
//         If you did not request this, please ignore this email and your password will remain unchanged.\n`
//     };

//     transporter.sendMail(mailOptions, (err, response) => {
//       if (err) {
//         console.error('There was an error:', err);
//         return res.status(500).json({ msg: 'Error sending email' });
//       } else {
//         res.status(200).json('Recovery email sent');
//       }
//     });
//   } catch (err) {
//     console.error('Forget password error:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

// exports.renderResetPasswordForm = (req, res) => {
//   res.redirect(`/reset/${req.params.token}`);
// };

// exports.resetPassword = async (req, res) => {
//   const { newPassword, confirmPassword } = req.body;
//   const { token } = req.params;

//   console.log(`Token: ${token}`);
//   console.log(`Received newPassword: ${newPassword}`);
//   console.log(`Received confirmPassword: ${confirmPassword}`);

//   if (!newPassword || !confirmPassword) {
//     return res.status(400).json({ msg: 'Both password fields are required' });
//   }

//   if (newPassword !== confirmPassword) {
//     return res.status(400).json({ msg: 'Passwords do not match' });
//   }

//   try {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ msg: 'Password reset token is invalid or has expired' });
//     }

//     user.password = await bcrypt.hash(newPassword, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.status(200).json({ msg: 'Password has been updated' });
//   } catch (err) {
//     console.error('Error resetting password:', err);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };


const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure Nodemailer with Gmail credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10)
    });

    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    user.password = undefined;

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'No user found with that email' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Fundwise Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('There was an error:', err);
        return res.status(500).json({ msg: 'Error sending email' });
      } else {
        res.status(200).json('Recovery email sent');
      }
    });
  } catch (err) {
    console.error('Forget password error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.renderResetPasswordForm = (req, res) => {
  res.redirect(`/reset/${req.params.token}`);
};

exports.resetPassword = async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { token } = req.params;

  console.log(`Token: ${token}`);
  console.log(`Received newPassword: ${newPassword}`);
  console.log(`Received confirmPassword: ${confirmPassword}`);

  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ msg: 'Both password fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Password reset token is invalid or has expired' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ msg: 'Password has been updated' });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.validateToken = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ msg: 'Invalid token' });
    }

    res.json(user); // Send user details back
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
