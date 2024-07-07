const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { signup, login, forgetPassword, renderResetPasswordForm, resetPassword, validateToken } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.get('/reset/:token', renderResetPasswordForm);
router.post('/reset/:token', resetPassword);
router.get('/validate-token', validateToken); 

router.get('/protected-route', authMiddleware, (req, res) => {
    res.send('This is a protected route');
  });

module.exports = router;
