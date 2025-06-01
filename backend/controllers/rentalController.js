const Rental = require('../models/rentalModel');
const Property = require('../models/propertyModel');
const Payment = require('../models/paymentModel');
const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');

// @desc    Create a new rental
// @route   POST /api/rentals
// @access  Private
const createRental = asyncHandler(async (req, res) => {
  const { propertyId, startDate, endDate, totalAmount, selectedServices } = req.body;

  // Check if property exists
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if the current user already has an active rental for this property
  const existingRental = await Rental.findOne({
    property: propertyId,
    user: req.user._id,
    status: 'active'
  });

  if (existingRental) {
    // If a rental already exists, return it instead of creating a new one
    return res.status(200).json(existingRental);
  }

  // Check if property is not owned by the current user
  if (property.user.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot rent your own property');
  }

  // Calculate services amount if services are selected
  let servicesAmount = 0;
  if (selectedServices) {
    if (selectedServices.packing && property.additionalServices?.packing?.available) {
      servicesAmount += property.additionalServices.packing.price;
    }
    if (selectedServices.moving && property.additionalServices?.moving?.available) {
      servicesAmount += property.additionalServices.moving.price;
    }
    if (selectedServices.cleaning && property.additionalServices?.cleaning?.available) {
      servicesAmount += property.additionalServices.cleaning.price;
    }
    if (selectedServices.painting && property.additionalServices?.painting?.available) {
      servicesAmount += property.additionalServices.painting.price;
    }
  }

  // Generate monthly payment schedule
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const monthlyPayments = [];
  
  // Add first month's payment due immediately
  monthlyPayments.push({
    month: startDateObj.getMonth() + 1,
    year: startDateObj.getFullYear(),
    status: 'pending',
    dueDate: startDateObj,
  });
  
  // Add subsequent monthly payments
  let currentDate = new Date(startDateObj);
  currentDate.setMonth(currentDate.getMonth() + 1);
  
  while (currentDate < endDateObj) {
    monthlyPayments.push({
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      status: 'pending',
      dueDate: new Date(currentDate),
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  // Create rental with monthly payment schedule
  const rental = await Rental.create({
    user: req.user._id,
    property: propertyId,
    paymentStatus: 'pending',
    startDate,
    endDate,
    status: 'active',
    totalAmount: totalAmount + servicesAmount,
    rentAmount: property.rent,
    selectedServices: selectedServices || {
      packing: false,
      moving: false,
      cleaning: false,
      painting: false
    },
    servicesAmount,
    monthlyPayments
  });

  res.status(201).json(rental);
});

// @desc    Get user rentals
// @route   GET /api/rentals/user
// @access  Private
const getUserRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find({ user: req.user._id })
    .populate('property')
    .sort({ createdAt: -1 });

  res.json(rentals);
});

// @desc    Get property owner's rentals
// @route   GET /api/rentals/property-owners
// @access  Private
const getPropertyOwnersRentals = asyncHandler(async (req, res) => {
  // First, get all properties owned by this user
  const properties = await Property.find({ user: req.user._id }).select('_id');
  
  // Get property IDs
  const propertyIds = properties.map(property => property._id);
  
  // Find all rentals for these properties
  const rentals = await Rental.find({ property: { $in: propertyIds } })
    .populate('property')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });
  
  res.json(rentals);
});

// @desc    Get rental by ID
// @route   GET /api/rentals/:id
// @access  Private
const getRentalById = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate('property')
    .populate('user', 'name email phone');

  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // More permissive authorization check
  const isRenter = rental.user._id.toString() === req.user._id.toString();
  const isPropertyOwner = rental.property && rental.property.user && 
                         rental.property.user.toString() === req.user._id.toString();
  const isAdmin = req.user.isAdmin;

  if (!isRenter && !isPropertyOwner && !isAdmin) {
    res.status(401);
    throw new Error('Not authorized to access this rental');
  }

  res.json(rental);
});

// @desc    Get all rentals (admin only)
// @route   GET /api/rentals
// @access  Private/Admin
const getAllRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find({})
    .populate('property')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json(rentals);
});

// @desc    Update rental status
// @route   PUT /api/rentals/:id
// @access  Private
const updateRentalStatus = asyncHandler(async (req, res) => {
  const { status, paymentStatus, paymentId } = req.body;

  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Check if user is authorized (tenant or property owner or admin)
  const property = await Property.findById(rental.property);
  const isRenter = rental.user.toString() === req.user._id.toString();
  const isPropertyOwner = property && property.user.toString() === req.user._id.toString();
  
  if (!isRenter && !isPropertyOwner && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to update this rental');
  }

  // Update rental fields
  if (status) rental.status = status;
  if (paymentStatus) rental.paymentStatus = paymentStatus;
  if (paymentId) rental.paymentId = paymentId;

  // If rental status is changed to 'terminated' or 'expired', make property available again
  if ((status === 'terminated' || status === 'expired') && rental.status === 'active') {
    property.available = true;
    await property.save();
  }
  
  // If payment status changes to 'paid', update the property availability
  if (paymentStatus === 'paid' && rental.paymentStatus !== 'paid') {
    property.available = false;
    await property.save();
  }

  const updatedRental = await rental.save();

  res.json(updatedRental);
});

// @desc    Pay monthly rent
// @route   POST /api/rentals/:id/pay-rent
// @access  Private
const payMonthlyRent = asyncHandler(async (req, res) => {
  const { month, year, paymentMethod } = req.body;

  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Check if user is the renter
  if (rental.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You can only pay rent for your own rentals');
  }

  // Find the monthly payment entry
  const paymentEntry = rental.monthlyPayments.find(
    p => p.month === parseInt(month) && p.year === parseInt(year)
  );

  if (!paymentEntry) {
    res.status(404);
    throw new Error('Payment entry not found for the specified month and year');
  }

  if (paymentEntry.status === 'paid') {
    res.status(400);
    throw new Error('This month\'s rent has already been paid');
  }

  // Create payment record
  const payment = await Payment.create({
    user: req.user._id,
    property: rental.property,
    amount: rental.rentAmount,
    paymentMethod: paymentMethod || 'card',
    status: 'completed',
  });

  // Update payment entry
  paymentEntry.status = 'paid';
  paymentEntry.paidDate = new Date();
  paymentEntry.paymentId = payment._id;

  await rental.save();

  res.status(200).json({
    success: true,
    message: 'Rent payment successful',
    paymentDetails: {
      month,
      year,
      amount: rental.rentAmount,
      paidOn: paymentEntry.paidDate,
      paymentId: payment._id
    }
  });
});

// @desc    Add additional services to rental
// @route   POST /api/rentals/:id/services
// @access  Private
const addExtraServices = asyncHandler(async (req, res) => {
  const { services } = req.body;

  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Check if user is the renter
  if (rental.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('You can only add services to your own rentals');
  }

  // Get property to access service prices
  const property = await Property.findById(rental.property);
  if (!property) {
    res.status(404);
    throw new Error('Associated property not found');
  }

  let servicesAmount = 0;
  let selectedServices = { ...rental.selectedServices };
  
  // Calculate cost for requested services
  Object.keys(services).forEach(service => {
    if (services[service] && !rental.selectedServices[service]) {
      selectedServices[service] = true;
      
      // Add service price if available
      if (property.additionalServices && property.additionalServices[service] && 
          property.additionalServices[service].available) {
        servicesAmount += property.additionalServices[service].price;
      }
    }
  });

  // If no new services were added
  if (servicesAmount === 0) {
    res.status(400);
    throw new Error('No new services added');
  }

  // Create payment for services
  const payment = await Payment.create({
    user: req.user._id,
    property: rental.property,
    amount: servicesAmount,
    paymentMethod: 'card',
    status: 'completed',
  });

  // Update rental with new services
  rental.selectedServices = selectedServices;
  rental.servicesAmount += servicesAmount;
  rental.totalAmount += servicesAmount;
  
  await rental.save();

  res.status(200).json({
    success: true,
    message: 'Services added successfully',
    selectedServices,
    servicesAmount,
    payment: {
      amount: servicesAmount,
      paymentId: payment._id
    }
  });
});

// @desc    Download rental agreement
// @route   GET /api/rentals/:id/agreement
// @access  Private
const downloadAgreement = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  
  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Check if user is authorized (renter or property owner)
  if (rental.user.toString() !== req.user._id.toString()) {
    const property = await Property.findById(rental.property);
    if (!property || property.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to download this agreement');
    }
  }

  // Get property to access rental agreement
  const property = await Property.findById(rental.property);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Check if property has rental agreement
  if (!property.rentalAgreement) {
    res.status(404);
    throw new Error('No rental agreement found for this property');
  }

  // Extract file path from database
  const filePath = path.join(process.cwd(), property.rentalAgreement.replace(/^\//, ''));
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    res.status(404);
    throw new Error('Agreement file not found');
  }

  // Send file as download
  res.download(filePath);
});

// @desc    Upload signed rental agreement
// @route   POST /api/rentals/:id/agreement
// @access  Private
const uploadSignedAgreement = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  
  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Check if user is the renter
  if (rental.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Only the tenant can upload a signed agreement');
  }

  // Check if file was uploaded
  if (!req.file) {
    res.status(400);
    throw new Error('No agreement file uploaded');
  }

  // Create file path for database
  const agreementPath = `/uploads/agreements/${req.file.filename}`;
  rental.signedAgreement = agreementPath;

  await rental.save();

  res.status(200).json({
    success: true,
    message: 'Signed agreement uploaded successfully',
    agreementPath
  });
});

// @desc    Cancel rental (only for pending payment rentals)
// @route   DELETE /api/rentals/:id
// @access  Private
const cancelRental = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) {
    res.status(404);
    throw new Error('Rental not found');
  }

  // Only the renter can cancel their rental
  if (rental.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(401);
    throw new Error('Not authorized to cancel this rental');
  }

  // Can only cancel rentals with pending payment
  if (rental.paymentStatus !== 'pending') {
    res.status(400);
    throw new Error('Cannot cancel a rental that has already been paid');
  }

  // Delete the rental record
  await Rental.deleteOne({ _id: req.params.id });

  res.json({ message: 'Rental cancelled successfully' });
});

module.exports = {
  createRental,
  getUserRentals,
  getRentalById,
  getAllRentals,
  updateRentalStatus,
  getPropertyOwnersRentals,
  cancelRental,
  payMonthlyRent,
  addExtraServices,
  downloadAgreement,
  uploadSignedAgreement
};
