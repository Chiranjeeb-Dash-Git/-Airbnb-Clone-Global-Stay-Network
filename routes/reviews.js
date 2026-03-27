const express = require('express');
const router = express.Router({ mergeParams: true }); // Important: mergeParams allows access to :id from parent router
const Listing = require('../models/listing');
const Review = require('../models/review');
const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isLoggedIn } = require('../middleware');

// Create a new review
router.post('/', 
    validateReview, 
    wrapAsync(async (req, res) => {
        const listing = await Listing.findById(req.params.id);
        const review = new Review(req.body.review);
        if (req.user) {
            review.author = req.user._id; // Set the author
        }
        listing.reviews.push(review);
        await review.save();
        await listing.save();
        req.flash('success', 'Review added successfully!');
        res.redirect(`/listings/${listing._id}`);
    })
);

// Delete a review
router.delete('/:reviewId',
    wrapAsync(async (req, res) => {
        const { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);
    })
);

module.exports = router; 