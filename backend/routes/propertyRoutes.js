
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

// Database seeding route - only in development
if (process.env.NODE_ENV === 'development') {
  router.route('/seed-images').post(protect, async (req, res) => {
    try {
      const Property = require('../models/propertyModel');
      const properties = await Property.find({ images: { $size: 0 } });
      
      const defaultPropertyImages = [
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&auto=format&fit=crop'
      ];
      
      for (const property of properties) {
        // Generate type-specific images
        let propertyImages = [];
        
        switch(property.type) {
          case 'apartment':
            propertyImages = [
              'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800&auto=format&fit=crop'
            ];
            break;
          case 'house':
            propertyImages = [
              'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop'
            ];
            break;
          case 'villa':
            propertyImages = [
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&auto=format&fit=crop'
            ];
            break;
          case 'condo':
            propertyImages = [
              'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1512916194211-3f2b7f5f7de3?w=800&auto=format&fit=crop'
            ];
            break;
          case 'office':
            propertyImages = [
              'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1604328698692-f76ea9498e76?w=800&auto=format&fit=crop'
            ];
            break;
          default:
            propertyImages = defaultPropertyImages;
        }
        
        // Update the property with the new images
        property.images = propertyImages;
        property.thumbnailUrl = propertyImages[0];
        await property.save();
      }
      
      res.status(200).json({ message: `Updated ${properties.length} properties with images` });
    } catch (error) {
      console.error('Error seeding images:', error);
      res.status(500).json({ message: 'Error seeding images' });
    }
  });
}

module.exports = router;
