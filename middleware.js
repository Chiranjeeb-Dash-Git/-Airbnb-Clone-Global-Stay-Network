const { listingSchema, reviewSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const Listing = require('./models/listing');
const Review = require('./models/review');



// Middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
};

// Middleware to validate listing data
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', msg);
        return res.redirect('/listings/new');
    } else {
        next();
    }
};

// Middleware to validate review data
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        req.flash('error', msg);
        return res.redirect('/listings/new');
    } else {
        next();
    }
}; 

// Middleware to make flash messages available in views
module.exports.flashMessages = (req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
};

// Middleware to check if user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to delete this review');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Middleware to check if user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.user || !listing.user.equals(req.user._id)) {
        req.flash('error', 'You are not authorized to delete this listing');
        return res.redirect('/listings');
    }
    next();
};
