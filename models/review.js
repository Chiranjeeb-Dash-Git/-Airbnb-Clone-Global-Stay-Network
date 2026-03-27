const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the review schema
const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Create the Review model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
