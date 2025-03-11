
const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPaymentById,
  getUserPayments,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createPayment);
router.route('/user').get(protect, getUserPayments);
router.route('/:id').get(protect, getPaymentById);

module.exports = router;
