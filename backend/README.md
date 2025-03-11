
# Rental App Backend API

This is the backend API for the Rental App, built with Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/rentalapp
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Authenticate user & get token
- `GET /api/users/me` - Get user profile (Protected)
- `PUT /api/users/update` - Update user profile (Protected)

### Properties
- `POST /api/properties` - Create a new property (Protected)
- `GET /api/properties` - Get all available properties
- `GET /api/properties/:id` - Get property by ID
- `GET /api/properties/user` - Get user's properties (Protected)
- `PUT /api/properties/:id` - Update property (Protected)
- `DELETE /api/properties/:id` - Delete property (Protected)

### Rentals
- `POST /api/rentals` - Create a new rental (Protected)
- `GET /api/rentals/user` - Get user's rentals (Protected)
- `GET /api/rentals/:id` - Get rental by ID (Protected)

### Payments
- `POST /api/payments` - Create a new payment (Protected)
- `GET /api/payments/user` - Get user's payments (Protected)
- `GET /api/payments/:id` - Get payment by ID (Protected)
