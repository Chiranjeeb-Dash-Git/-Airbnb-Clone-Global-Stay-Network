// ====================
// 1. Environment Setup
// ====================
if(process.env.NODE_ENV !== "production"){
require('dotenv').config();
}

// ====================
// 2. Module Imports
// ====================
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const multer = require('multer');

// Custom Modules
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');
const middleware = require('./middleware');

// Route Imports
const listingRoutes = require('./routes/listing');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/user');

// ====================
// 3. App Configuration
// ====================
const app = express();
const port = process.env.PORT || 8080;

// View Engine Setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ====================
// 4. Middleware Setup
// ====================
// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Method Override
app.use(methodOverride('_method'));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

// Flash Messages
app.use(flash());

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Local Variables
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// ====================
// 5. Routes
// ====================
// API Routes
app.use('/listings', listingRoutes);
app.use('/listings/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// Root Route
app.get('/', (req, res) => {
    return res.redirect('/listings');
});

// Favicon Route
app.get('/favicon.ico', (req, res) => {
    return res.status(204).end();
});

// ====================
// 6. Error Handling
// ====================
// 404 Handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Error Handler
app.use((err, req, res, next) => {
    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err);
    }
    
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

// ====================
// 7. Database Connection
// ====================
mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });

// ====================
// 8. Server Start
// ====================
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

process.removeAllListeners('warning');
