const Listing = require('../models/listing'); //
const ExpressError = require('../utils/ExpressError');
const Joi = require('joi');
const Review = require('../models/review');

// Index - Show all listings
module.exports.index = async (req, res) => {
    try {
        const listings = await Listing.find({}).populate({ path: 'reviews', select: 'rating' });

        const listingsWithStats = listings.map((l) => {
            const ratings = (l.reviews || []).map((r) => r.rating).filter((n) => typeof n === 'number');
            const reviewCount = ratings.length;
            const avgRating = reviewCount ? (ratings.reduce((a, b) => a + b, 0) / reviewCount) : null;
            return {
                ...l.toObject(),
                reviewCount,
                avgRating: avgRating ? Math.round(avgRating * 10) / 10 : null
            };
        });

        res.render('listings/index', { listings: listingsWithStats });
    } catch (error) {
        console.error('ERROR in listings index:', error);
        res.status(500).render('error', { err: { message: 'Failed to load listings. ' + error.message } });
    }
};
// Show - Show one listing
module.exports.show = async (req, res) => {
    try {
        const { id } = req.params;
        const listingDoc = await Listing.findById(id)
            .populate({ path: 'user', select: 'username firstName lastName' })
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author',
                    select: 'username'
                }
            });
        if (!listingDoc) {
            req.flash('error', 'Listing not found.');
            return res.redirect('/listings');
        }
        const ratings = (listingDoc.reviews || []).map((r) => r.rating).filter((n) => typeof n === 'number');
        const reviewCount = ratings.length;
        const avgRating = reviewCount ? Math.round((ratings.reduce((a, b) => a + b, 0) / reviewCount) * 10) / 10 : null;

        const listing = {
            ...listingDoc.toObject(),
            reviewCount,
            avgRating
        };

        res.render('listings/show', {
            listing,
            transparentNav: true
        });
    } catch (error) {
        req.flash('error', 'Failed to load listing.');
        res.redirect('/listings');
    }
};

// New - Show form to create new listing
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new', { 
        title: 'Add New Listing',
        transparentNav: true
    });
};

// Create - Create a new listing
module.exports.createListing = async (req, res) => {
    // Ensure required fields are present
    if (!req.body.listing) {
        throw new ExpressError('Listing data is required', 400);
    }

    const newListing = new Listing(req.body.listing);
    
    // Handle image uploads if needed
    if (req.files && req.files.length > 0) {
        newListing.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    }

    // Optional geometry coordinates in "lng, lat" format
    const coordInput = req.body?.listing?.geometry?.coordinates;
    if (typeof coordInput === 'string' && coordInput.trim()) {
        const parts = coordInput.split(',').map((p) => Number(p.trim()));
        if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
            newListing.geometry = { type: 'Point', coordinates: [parts[0], parts[1]] };
        }
    }

    await newListing.save();
    res.status(201).json(newListing);
};

// Edit - Show form to edit listing
module.exports.renderEditForm = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash('error', 'Listing not found.');
            return res.redirect('/listings');
        }
        res.render('listings/edit', { listing, title: 'Edit Listing' });
    } catch (error) {
        req.flash('error', 'Failed to load edit form.');
        res.redirect('/listings');
    }
};

// Update - Update a listing
module.exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
        if (!listing) {
            req.flash('error', 'Listing not found.');
            return res.redirect('/listings');
        }
        req.flash('success', 'Successfully updated listing!');
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        req.flash('error', 'Failed to update listing.');
        res.redirect('/listings');
    }
};

// Delete - Delete a listing
module.exports.deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findByIdAndDelete(id);
        if (!listing) {
            req.flash('error', 'Listing not found.');
            return res.redirect('/listings');
        }
        req.flash('success', 'Successfully deleted listing!');
        res.redirect('/listings');
    } catch (error) {
        req.flash('error', 'Failed to delete listing.');
        res.redirect('/listings');
    }
};

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),  // Changed from name to title
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        imageUrl: Joi.string().allow('').optional(),
        // Add other fields as needed
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
});






