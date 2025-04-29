
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  verifyEmail,
  requestPhoneVerification,
  verifyPhone,
  submitIdentityVerification,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.route('/me').get(protect, getUserProfile);
router.route('/update').put(protect, updateUserProfile);
router.post('/verify-phone-request', protect, requestPhoneVerification);
router.post('/verify-phone', protect, verifyPhone);
router.post('/verify-identity', protect, submitIdentityVerification);

module.exports = router;
