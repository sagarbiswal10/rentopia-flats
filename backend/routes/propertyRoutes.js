
const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getPropertyById,
  getUserProperties,
  updateProperty,
  deleteProperty,
  reportProperty,
  verifyUserIdentity,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getProperties).post(protect, createProperty);
router.route('/user').get(protect, getUserProperties);
router
  .route('/:id')
  .get(getPropertyById)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);
router.route('/:id/report').post(protect, reportProperty);
router.route('/verify-identity').post(protect, verifyUserIdentity);

module.exports = router;
