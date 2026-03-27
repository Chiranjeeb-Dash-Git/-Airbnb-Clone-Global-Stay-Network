const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: String,
    lastName: String,
    profileImage: String,
    coverImage: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    googleId: String,
    facebookId: String,
    twitterId: String,
    instagramId: String,
    linkedinId: String,
    githubId: String,
    bio: String,
    location: String,
    website: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    savedComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    savedLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
    savedNotifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }],
    savedMessages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing'
    }]
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);

module.exports = User;










