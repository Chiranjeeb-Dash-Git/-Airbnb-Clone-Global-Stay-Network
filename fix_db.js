const mongoose = require('mongoose');
const Listing = require('./models/listing');
const { data } = require('./init/data');

mongoose.connect('mongodb://127.0.0.1:27017/airbnb')
    .then(async () => {
        console.log('Connected to MongoDB');
        
        try {
            await mongoose.connection.db.collection('listings').dropIndex('location_2dsphere');
            console.log('Dropped location_2dsphere index');
        } catch (e) {
            console.log('No location_2dsphere index found or already dropped');
        }
        
        let fixedCount = 0;
        for (const item of data) {
            // Find listing bypassing mongoose schema to avoid cast errors
            const listing = await mongoose.connection.db.collection('listings').findOne({ title: item.title });
            
            if (listing && typeof listing.location !== 'string') {
                await mongoose.connection.db.collection('listings').updateOne(
                    { _id: listing._id },
                    { $set: { location: item.location } }
                );
                fixedCount++;
            } else if (listing && typeof listing.location === 'string') {
                await mongoose.connection.db.collection('listings').updateOne(
                    { _id: listing._id },
                    { $set: { location: item.location } }
                );
                fixedCount++;
            }
        }
        
        console.log(`Fixed location for ${fixedCount} listings from data.js`);
        
        // Also look for any listings with object location that weren't in data.js
        const unknownListings = await mongoose.connection.db.collection('listings').find({
            location: { $type: "object" }
        }).toArray();
        
        for (const unk of unknownListings) {
            await mongoose.connection.db.collection('listings').updateOne(
                { _id: unk._id },
                { $set: { location: "Unknown Location" } }
            );
            console.log(`Fixed unknown listing location for id ${unk._id}`);
        }
        
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
