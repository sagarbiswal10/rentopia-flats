
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

## Importing Data

The application comes with a data seeder that will populate your database with:
- 6 sample users (including one admin user)
- 6 sample properties with different configurations
  
All properties are initially set as available for rent. Once a user rents a property, its availability status will be updated to false.

To import the sample data, run:
```
npm run data:import
```

To delete all data from the database:
```
npm run data:destroy
```

## Workflow

1. Users can register or login to the application
2. Properties are listed on the homepage and properties page
3. Logged-in users can rent properties by going through the payment process
4. After payment, a rental record is created in the database
5. Users can view their rental history in their dashboard
6. Property owners can view properties they've listed and their rental status

## API Endpoints

### Users
- `POST /api/users` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Properties
- `GET /api/properties` - Get all available properties
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
- `GET /api/rentals` - Get all rentals (admin only)

### Payments
- `POST /api/payments` - Create a new payment
- `GET /api/payments/user` - Get user's payments
- `GET /api/payments/:id` - Get payment by ID
