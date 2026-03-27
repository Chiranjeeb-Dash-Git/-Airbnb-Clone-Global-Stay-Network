const mongoose = require("mongoose");
const { data } = require("./data");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Booking = require("../models/booking.js");

async function initDB() {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
        console.log("MONGODB CONNECTED!");
        
        // Delete existing data
        await User.deleteMany({});
        await Listing.deleteMany({});
        await Booking.deleteMany({});
        console.log("Deleted all existing data!");

        const owner = new User({
            username: "owner",
            email: "owner@gmail.com"
        }); 
        const registeredUser = await User.register(owner, "password");
        
        // Insert new data with owner ID
        const updatedData = data.map((obj) => ({
            ...obj,
            user: registeredUser._id,
            geometry: {
                type: "Point",
                coordinates: [0, 0]
            },
            maxGuests: obj.maxGuests ?? 4,
            bedrooms: obj.bedrooms ?? 2,
            bathrooms: obj.bathrooms ?? 1,
            amenities: obj.amenities ?? ["Wifi", "Kitchen", "Free parking", "Air conditioning"],
        }));

        const insertedData = await Listing.insertMany(updatedData);
        console.log(`${insertedData.length} listings inserted!`);

        // Add some favorites to the owner
        registeredUser.favorites.push(insertedData[0]._id, insertedData[1]._id);
        await registeredUser.save();
        console.log("Added favorites to owner!");

        // Add some bookings for the owner
        const bookings = [
            {
                listing: insertedData[2]._id,
                user: registeredUser._id,
                checkIn: new Date("2024-05-10"),
                checkOut: new Date("2024-05-15"),
                guests: 2,
                totalPrice: insertedData[2].price * 5,
                status: 'confirmed'
            },
            {
                listing: insertedData[3]._id,
                user: registeredUser._id,
                checkIn: new Date("2024-06-20"),
                checkOut: new Date("2024-06-25"),
                guests: 4,
                totalPrice: insertedData[3].price * 5,
                status: 'pending'
            }
        ];
        await Booking.insertMany(bookings);
        console.log("Inserted dummy bookings!");

    } catch (err) {
        console.log("MONGODB ERROR!");
        console.log(err);
    } finally {
        mongoose.disconnect();
    }
}

initDB();
