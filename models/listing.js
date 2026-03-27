const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


// Define the schema for a listing
const listingSchema = new Schema({
    title: {
        type: String,
        required: true, // Title is required
    },
    description: {
        type: String,
        required: true, // Description is required
    },
    image: {
        filename: {
            type: String,
            default: "default.jpg", // Default filename for image
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1542618285-a61de7ed7ff1?w=300", // Default image URL
            set: function(v) {
                return v || "https://images.unsplash.com/photo-1542618285-a61de7ed7ff1?w=300"; // Set default if no URL is provided
            }
        }
    },
    price: {
        type: Number,
        required: true, // Price is required
    },
    // Human-readable location (city/area)
    location: {
        type: String,
        required: true,
        trim: true
    },
    // Optional geo coordinates for maps/search
    geometry: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    country: {
        type: String,
        required: true, // Country is required
    },
    maxGuests: {
        type: Number,
        default: 4,
        min: 1
    },
    bedrooms: {
        type: Number,
        default: 2,
        min: 0
    },
    bathrooms: {
        type: Number,
        default: 1,
        min: 0
    },
    amenities: {
        type: [String],
        default: []
    },
    // Reviews field that references the 'Review' model
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review', // Reference to the Review model
            
        },
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Middleware to delete associated reviews when a listing is deleted
listingSchema.post('findOneAndDelete', async function(listing) {
    if (listing.reviews.length) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

// Add 2dsphere index for geospatial queries
listingSchema.index({ geometry: '2dsphere' });

// Create the Listing model using the schema
const Listing = mongoose.model('Listing', listingSchema);

// Export the Listing model for use in other files
module.exports = Listing;
