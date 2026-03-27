const express = require('express');
const router = express.Router();
const { isLoggedIn, validateListing, isOwner } = require('../middleware');
const listings = require('../controllers/listings');
const wrapAsync = require('../utils/wrapAsync');
const { cloudinary, storage } = require('../cloudConfig');
const multer = require('multer');
const upload = multer({ storage });
const Listing = require('../models/listing');
const Booking = require('../models/booking');

// Index - Show all listings
router.get('/', wrapAsync(listings.index));

// New - Show form to create new listing
router.get('/new', isLoggedIn, wrapAsync(listings.renderNewForm));

// Create - Create a new listing
router.post('/', isLoggedIn, upload.array('image'), validateListing, wrapAsync(async (req, res, next) => {
    try {
        const listing = await listings.createListing(req, res);
        res.status(201).json(listing);
    } catch (error) {
        next(error); // Pass the error to the error handling middleware
    }
}));

// Show - Show one listing
router.get('/:id', wrapAsync(listings.show));

// Book a listing
router.post('/:id/book', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found.');
        return res.redirect('/listings');
    }

    const { checkIn, checkOut, guests } = req.body || {};
    const checkInDate = checkIn ? new Date(checkIn) : null;
    const checkOutDate = checkOut ? new Date(checkOut) : null;
    const guestCount = Number(guests);

    if (!checkInDate || !checkOutDate || Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
        req.flash('error', 'Please select valid check-in and check-out dates.');
        return res.redirect(`/listings/${id}`);
    }
    if (!(guestCount >= 1)) {
        req.flash('error', 'Guests must be at least 1.');
        return res.redirect(`/listings/${id}`);
    }
    if (checkOutDate <= checkInDate) {
        req.flash('error', 'Check-out must be after check-in.');
        return res.redirect(`/listings/${id}`);
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * listing.price;

    await Booking.create({
        listing: listing._id,
        user: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guestCount,
        totalPrice,
        status: 'confirmed'
    });

    req.flash('success', 'Booking confirmed!');
    return res.redirect('/trips');
}));

// Edit - Show form to edit listing
router.get('/:id/edit', wrapAsync(listings.renderEditForm));

// Update - Update a listing
router.put('/:id', wrapAsync(listings.updateListing));

// Delete - Delete a listing
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listings.deleteListing));

module.exports = router;