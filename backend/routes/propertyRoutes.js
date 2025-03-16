
const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getPropertyById,
  getUserProperties,
  updateProperty,
  deleteProperty,
  updatePropertyAvailability,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getProperties).post(protect, createProperty);
router.route('/user').get(protect, getUserProperties);
router
  .route('/:id')
  .get(getPropertyById)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);
router.route('/:id/availability').put(protect, updatePropertyAvailability);

module.exports = router;
