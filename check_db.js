const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
    .then(async () => {
        console.log('Connected to MongoDB');
        // Find listings where location is not a string
        const listings = await mongoose.connection.db.collection('listings').find({
            location: { $type: "object" }
        }).toArray();
        console.log("Listings with object location count:", listings.length);
        if (listings.length > 0) {
            console.log("First listing with object location:", JSON.stringify(listings[0].location, null, 2));
        }
        
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
