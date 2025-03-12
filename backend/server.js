
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('./models/userModel');
const Property = require('./models/propertyModel');

// Routes
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);

// Seeder function to create dummy data
const seedData = async () => {
  try {
    // Check if there's already a landlord user
    const landlordExists = await User.findOne({ email: 'landlord@example.com' });
    
    if (landlordExists) {
      console.log('Seed data already exists'.yellow);
      return;
    }
    
    console.log('Seeding database with dummy data...'.cyan);
    
    // Create a landlord user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    const landlord = await User.create({
      name: 'Landlord Singh',
      email: 'landlord@example.com',
      password: hashedPassword,
      phone: '+91 9876543210',
    });
    
    console.log(`Created landlord user: ${landlord.name}`.green);
    
    // Property types
    const propertyTypes = ['apartment', 'house', 'villa', 'condo', 'office'];
    
    // Furnishing options
    const furnishingOptions = ['unfurnished', 'semi-furnished', 'fully-furnished'];
    
    // Cities
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai'];
    
    // Localities by city
    const localities = {
      'Mumbai': ['Andheri', 'Bandra', 'Juhu', 'Powai', 'Worli'],
      'Delhi': ['Connaught Place', 'Hauz Khas', 'Dwarka', 'Rohini', 'Saket'],
      'Bangalore': ['Koramangala', 'Indiranagar', 'Whitefield', 'Electronic City', 'Marathahalli'],
      'Hyderabad': ['Hitech City', 'Gachibowli', 'Banjara Hills', 'Jubilee Hills', 'Madhapur'],
      'Chennai': ['T Nagar', 'Adyar', 'Anna Nagar', 'Velachery', 'Porur'],
    };
    
    // Amenities
    const amenities = [
      'Parking', 'Security', 'Gym', 'Swimming Pool', 'Power Backup', 
      'Lift', 'Gas Pipeline', 'Club House', 'Children\'s Play Area', 'Garden',
      'WiFi', 'Air Conditioning', 'Water Purifier', 'Washing Machine', 'Refrigerator'
    ];
    
    // Create 10 properties
    for (let i = 0; i < 10; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const locality = localities[city][Math.floor(Math.random() * localities[city].length)];
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const furnishing = furnishingOptions[Math.floor(Math.random() * furnishingOptions.length)];
      
      // Random amenities (3-7)
      const numAmenities = Math.floor(Math.random() * 5) + 3;
      const propertyAmenities = [];
      for (let j = 0; j < numAmenities; j++) {
        const amenity = amenities[Math.floor(Math.random() * amenities.length)];
        if (!propertyAmenities.includes(amenity)) {
          propertyAmenities.push(amenity);
        }
      }
      
      // Random rent (15,000 to 50,000)
      const rent = Math.floor(Math.random() * 35000) + 15000;
      
      // Random deposit (2-4 months of rent)
      const deposit = rent * (Math.floor(Math.random() * 3) + 2);
      
      // Random bedrooms (1-4)
      const bedrooms = Math.floor(Math.random() * 4) + 1;
      
      // Random bathrooms (1-3)
      const bathrooms = Math.floor(Math.random() * 3) + 1;
      
      // Random area (600-2000 sq ft)
      const area = Math.floor(Math.random() * 1400) + 600;
      
      await Property.create({
        user: landlord._id,
        title: `${bedrooms} BHK ${propertyType} in ${locality}`,
        description: `Beautiful ${bedrooms} BHK ${propertyType} located in ${locality}, ${city}. This ${furnishing} property offers ${area} sq.ft of living space with ${bathrooms} bathrooms. Enjoy amenities like ${propertyAmenities.slice(0, 3).join(', ')} and more!`,
        type: propertyType,
        bedrooms,
        bathrooms,
        furnishing,
        rent,
        deposit,
        area,
        locality,
        city,
        state: 'India',
        available: true,
        amenities: propertyAmenities,
        thumbnailUrl: '/placeholder.svg',
        images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
        availableFrom: new Date(),
      });
    }
    
    console.log(`Created 10 properties for landlord`.green);
    console.log('Seed data created successfully!'.green);
    
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`.red);
  }
};

// Call the seeder function
seedData();

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});
