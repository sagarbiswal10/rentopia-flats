
const express = require('express');
const router = express.Router();
const {
  createProperty,
  getProperties,
  getPropertyById,
  getUserProperties,
  updateProperty,
  deleteProperty,
  verifyProperty,
  reportProperty,
} = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getProperties).post(protect, createProperty);
router.route('/user').get(protect, getUserProperties);
router
  .route('/:id')
  .get(getPropertyById)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);
router.route('/:id/verify').put(protect, admin, verifyProperty);
router.route('/:id/report').post(protect, reportProperty);

module.exports = router;
