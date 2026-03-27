const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const express = require('express');
const multer = require('multer');

cloudinary.config({
    cloud_url: process.env.CLOUDINARY_URL,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET 
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'airbnb_project',
      format: async (req, file) => ['jpg', 'jpeg', 'png', 'heic'], // supports multiple formats
    },
  });

module.exports = {
  cloudinary,
  storage,
}