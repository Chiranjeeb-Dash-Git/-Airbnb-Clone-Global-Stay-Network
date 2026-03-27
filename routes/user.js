const express = require("express"); // Express is a framework that helps with routing
const router = express.Router(); // Router is a middleware that helps with routing
const User = require("../models/user"); // User is a model that helps with authentication
const Listing = require("../models/listing");
const Booking = require("../models/booking");
const wrapAsync = require("../utils/wrapAsync"); // wrapAsync is a middleware that helps with error handling
const { isLoggedIn } = require("../middleware");
const passport = require('passport');
const session = require('express-session');

// Wishlists (Favorites) route
router.get('/favorites', isLoggedIn, wrapAsync(async (req, res) => {
    const user = await User.findById(req.user._id).populate('favorites');
    res.render('favorites', { wishlistListings: user.favorites });
}));

// Trips (Bookings) route
router.get('/trips', isLoggedIn, wrapAsync(async (req, res) => {
    const userBookings = await Booking.find({ user: req.user._id }).populate('listing');
    res.render('trips', { userBookings });
}));

// Cancel Booking route
router.delete('/bookings/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    // Check if the booking exists and belongs to the logged in user
    if (!booking) {
        req.flash('error', 'Booking not found');
        return res.redirect('/trips');
    }
    
    if (!booking.user.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to cancel this booking');
        return res.redirect('/trips');
    }
    
    // Instead of deleting, we update the status (or you could completely delete: await Booking.findByIdAndDelete(id))
    booking.status = 'cancelled';
    await booking.save();
    
    req.flash('success', 'Booking cancelled successfully');
    res.redirect('/trips');
}));

// Route to render the signup page
router.get('/signup', wrapAsync(async (req, res) => {
    res.render('signup', { currentPage: 'signup' });
}));

// Route to handle signup form submission
router.post('/signup', wrapAsync(async (req, res, next) => {
    try {
        // Support multiple form shapes: {email} or { user: { email } } or bracket-keys.
        const body = req.body || {};
        const userObj = body.user || body.User || {};

        const username = (body.username || userObj.username || body["user[username]"] || "").trim();
        const emailRaw =
            body.email ||
            userObj.email ||
            body["user[email]"] ||
            body.Email ||
            userObj.Email ||
            "";
        const email = String(emailRaw).trim().toLowerCase();
        const password = body.password || userObj.password || body["user[password]"];

        if (!username || !email || !password) {
            req.flash('error', 'Username, email, and password are required.');
            return res.redirect('/signup');
        }

        const newUser = new User({ username, email });
        // Ensure email is definitely present on the instance before register/save.
        newUser.email = email;

        const registeredUser = await User.register(newUser, password);
        
        // Automatically log the user in after successful signup
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to the platform!');
            res.redirect('/'); // Redirect to the homepage or another page after login
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));

// Route to render the login page
router.get('/login', (req, res) => {
    res.render('login', { 
        redirectUrl: req.query.redirect,
        currentPage: 'login'
    });
});

// Route to handle login form submission
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err); // Handle any errors
        if (!user) {
            req.flash('error', 'Invalid username or password.'); // Flash an error message if authentication fails
            return res.redirect('/login'); // Redirect back to login page
        }
        req.logIn(user, (err) => {
            if (err) return next(err); // Handle any errors during login
            req.flash('success', 'You have successfully logged in!'); // Flash a success message upon successful login
            return res.redirect('/listings'); // Redirect to listings page
        });
    })(req, res, next);
});

// Route to handle user logout
router.get('/logout', (req, res, next) => {
    req.logout((err) => { // Log the user out
        if (err) return next(err); // Pass any errors to the next middleware
        req.flash('success', 'You have successfully logged out!'); // Flash a success message
        res.redirect('/'); // Redirect to the homepage after logout
    });
});

// Route to render a protected route
router.get('/someProtectedRoute', (req, res) => {
    console.log(req.user); // This should log the user object if logged in
    res.render('someView');
});

// Export the router to be used in other parts of the application
module.exports = router;



