
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Import seeder functions
const Property = require('./models/propertyModel');
const User = require('./models/userModel');
const Rental = require('./models/rentalModel');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);

// Error handler middleware
app.use(errorHandler);

// Sample user data (for property ownership and renting)
const users = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    password: 'password123',
    phone: '9876543210',
    isAdmin: true
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

// Sample properties data
const properties = [
  {
    title: "Spacious 3 BHK Apartment with Garden View",
    description: "Beautiful 3 bedroom apartment in a gated community with 24/7 security. The apartment is semi-furnished with wardrobes in all bedrooms, modular kitchen with chimney and hob, and air conditioners in the living room and master bedroom.\n\nThe society has a swimming pool, gym, children's play area, and well-maintained garden. It is located close to schools, hospitals, and shopping malls, making it an ideal place for families.",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    furnishing: "semi-furnished",
    rent: 30000,
    deposit: 100000,
    area: 1250,
    locality: "Koramangala",
    city: "Bangalore",
    state: "Karnataka",
    available: true,
    amenities: [
      "Power Backup", 
      "Lift", 
      "Security", 
      "Garden", 
      "Gym", 
      "Swimming Pool", 
      "Parking"
    ],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    title: "Modern 2 BHK Flat with Balcony",
    description: "Fully furnished 2 BHK apartment in a prime location with modern amenities. The apartment comes with air conditioning in all rooms, fully equipped kitchen with refrigerator, microwave, and washing machine.\n\nThe flat has a spacious balcony with a great view of the city. The society has a gym, club house, and 24/7 security with CCTV surveillance. Located close to metro station, shopping centers, and restaurants.",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    furnishing: "fully-furnished",
    rent: 25000,
    deposit: 75000,
    area: 950,
    locality: "Indiranagar",
    city: "Bangalore",
    state: "Karnataka",
    available: true,
    amenities: [
      "Power Backup", 
      "Lift", 
      "Security", 
      "Gym", 
      "Parking", 
      "Club House", 
      "CCTV"
    ],
    images: [
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1574739782594-db4ead022697?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    title: "Luxurious 4 BHK Villa with Private Garden",
    description: "Luxurious 4 bedroom villa in a gated community with private garden and parking space. The villa has spacious rooms with attached bathrooms, large kitchen, living and dining area, and a separate utility space.\n\nThe community has a clubhouse, swimming pool, tennis court, and 24/7 security. Located in a serene environment yet close to IT parks, international schools, hospitals, and shopping centers.",
    type: "villa",
    bedrooms: 4,
    bathrooms: 4,
    furnishing: "unfurnished",
    rent: 85000,
    deposit: 300000,
    area: 2800,
    locality: "Whitefield",
    city: "Bangalore",
    state: "Karnataka",
    available: true,
    amenities: [
      "Power Backup", 
      "Security", 
      "Garden", 
      "Parking", 
      "Clubhouse", 
      "Swimming Pool", 
      "Tennis Court"
    ],
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1613977257592-4a9a32f9141f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    title: "1 BHK Apartment for Bachelors near Metro",
    description: "Cozy 1 bedroom apartment perfect for bachelors or working professionals. The apartment comes with basic furniture including bed, wardrobe, dining table, and refrigerator.\n\nThe property is located just 5 minutes from the metro station, making commuting easy. Numerous restaurants, supermarkets, and convenience stores are in the vicinity.",
    type: "apartment",
    bedrooms: 1,
    bathrooms: 1,
    furnishing: "semi-furnished",
    rent: 15000,
    deposit: 50000,
    area: 650,
    locality: "HSR Layout",
    city: "Bangalore",
    state: "Karnataka",
    available: true,
    amenities: [
      "Power Backup", 
      "Lift", 
      "Security", 
      "Parking"
    ],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    title: "Elegant 3 BHK Apartment with Lake View",
    description: "Elegant 3 BHK apartment with a stunning view of the lake. Fully furnished with premium furniture, appliances, and decor. The apartment features a large balcony where you can enjoy the serene lake view.\n\nThe society offers a host of amenities including swimming pool, gym, club house with indoor games, children's play area, and landscaped gardens. Located in a prime area close to major IT parks and schools.",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 3,
    furnishing: "fully-furnished",
    rent: 45000,
    deposit: 150000,
    area: 1800,
    locality: "Bellandur",
    city: "Bangalore",
    state: "Karnataka",
    available: true,
    amenities: [
      "Power Backup", 
      "Lift", 
      "Security", 
      "Garden", 
      "Gym", 
      "Swimming Pool", 
      "Club House", 
      "Indoor Games"
    ],
    images: [
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1515263487990-61b07816b324?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  },
  {
    title: "Compact 2 BHK Flat in Residential Area",
    description: "Unfurnished 2 BHK apartment in a quiet residential area. The apartment has a modular kitchen, balcony, and good ventilation. The society has power backup, lift, and covered parking space.\n\nLocated in a well-established residential area with all essential amenities like schools, hospitals, markets, and public transport facilities within walking distance.",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    furnishing: "unfurnished",
    rent: 18000,
    deposit: 60000,
    area: 850,
    locality: "BTM Layout",
    city: "Bangalore",
    state: "Karnataka",
    available: true,
    amenities: [
      "Power Backup", 
      "Lift", 
      "Security", 
      "Parking"
    ],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1534595038511-9f219fe0c979?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    ],
    thumbnailUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
  }
];

// Function to seed data
const seedData = async () => {
  try {
    // Check if we need to seed the data
    const propertyCount = await Property.countDocuments();
    const userCount = await User.countDocuments();
    
    // Only seed if there's no data
    if (propertyCount === 0 && userCount === 0) {
      console.log('No data found, seeding database...');
      
      // Clear existing data if any
      await Property.deleteMany();
      await User.deleteMany();
      await Rental.deleteMany();

      // Insert users
      const createdUsers = [];
      for (const user of users) {
        const createdUser = await User.create(user);
        createdUsers.push(createdUser);
      }

      console.log(`${createdUsers.length} users created successfully`);

      // Insert properties (assigning each to a user)
      const propertyPromises = properties.map((property, index) => {
        return Property.create({
          ...property,
          user: createdUsers[index % createdUsers.length]._id, // Assign to users in rotation
        });
      });

      const createdProperties = await Promise.all(propertyPromises);
      console.log(`${createdProperties.length} properties imported successfully!`);
    } else {
      console.log('Database already contains data, skipping seed process');
    }
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
  }
};

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/rentalapp';
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed data automatically
    await seedData();
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
