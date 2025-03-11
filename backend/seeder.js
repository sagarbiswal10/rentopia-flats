
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Property = require('./models/propertyModel');
const User = require('./models/userModel');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample user data (for property ownership)
const users = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'password123',
    phone: '9876543210',
  },
  {
    name: 'Priya Singh',
    email: 'priya@example.com',
    password: 'password123',
    phone: '8765432109',
  },
  {
    name: 'Vijay Sharma',
    email: 'vijay@example.com',
    password: 'password123',
    phone: '7654321098',
  },
  {
    name: 'Anil Reddy',
    email: 'anil@example.com',
    password: 'password123',
    phone: '6543210987',
  },
  {
    name: 'Meera Patel',
    email: 'meera@example.com',
    password: 'password123',
    phone: '5432109876',
  },
  {
    name: 'Suresh Nair',
    email: 'suresh@example.com',
    password: 'password123',
    phone: '4321098765',
  }
];

// Import properties data
const propertiesData = require('../src/data/properties');

// Function to map property data to match our schema
const mapPropertyData = (property, userId) => {
  return {
    user: userId,
    title: property.title,
    description: property.description,
    type: property.type.toLowerCase(), // Convert to lowercase to match enum
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    furnishing: property.furnishing.toLowerCase().replace('-', ''), // Convert to match enum
    rent: property.rent,
    deposit: property.deposit,
    area: property.area,
    locality: property.locality,
    city: property.city,
    state: property.state,
    available: true,
    amenities: property.amenities,
    images: property.images,
    thumbnailUrl: property.images[0], // Use first image as thumbnail
  };
};

// Import data to database
const importData = async () => {
  try {
    // Clear existing data
    await Property.deleteMany();
    await User.deleteMany();

    // Insert users and get their IDs
    const createdUsers = [];
    for (const user of users) {
      const createdUser = await User.create(user);
      createdUsers.push(createdUser);
    }

    // Map and insert properties (assigning each to a user)
    const mappedProperties = propertiesData.map((property, index) => 
      mapPropertyData(property, createdUsers[index % createdUsers.length]._id)
    );
    
    await Property.insertMany(mappedProperties);

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from database
const destroyData = async () => {
  try {
    await Property.deleteMany();
    await User.deleteMany();
    
    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments to determine action
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
