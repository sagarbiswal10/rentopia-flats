
# RentalApp Backend

Backend for RentalApp, a property rental management application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the backend folder with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```

3. Import sample data:
   ```
   npm run data:import
   ```
   This will populate your database with sample users and properties.

4. Start the server:
   ```
   npm run server
   ```

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Properties
- `GET /api/properties` - Get all properties
- `POST /api/properties` - Create a new property
- `GET /api/properties/:id` - Get property by ID
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `GET /api/properties/user` - Get user's properties

### Rentals
- `POST /api/rentals` - Create a new rental
- `GET /api/rentals/user` - Get user's rentals
- `GET /api/rentals/:id` - Get rental by ID
- `PUT /api/rentals/:id` - Update rental status

### Payments
- `POST /api/payments` - Create a new payment
- `GET /api/payments/user` - Get user's payments
- `GET /api/payments/:id` - Get payment by ID

## Database Seeding

- To import sample data:
  ```
  npm run data:import
  ```

- To delete all data:
  ```
  npm run data:destroy
  ```
