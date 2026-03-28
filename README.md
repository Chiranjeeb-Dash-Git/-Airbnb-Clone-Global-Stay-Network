# 🏠 Airbnb Clone - Global Stay Network

A premium, full-stack web application replicating the core experience of Airbnb. This project features dynamic property listings, user authentication, interactive maps, image uploads via Cloudinary, and a responsive modern design.

[![Live Demo](https://img.shields.io/badge/Live-Demo-FF385C?style=for-the-badge&logo=render&logoColor=white)](https://airbnb-global-stay-network.onrender.com/)

---

## 🌟 Key Features

- **Dynamic Property Listings**: Browse, search, and filter premium stays around the world.
- **Interactive Search & Filters**: Search by location, title, or country with real-time category filtering.
- **User Authentication**: Secure Login/Signup using Passport.js and Local Strategy.
- **Property Management**: Complete CRUD operations for hosts (Create, Read, Update, Delete).
- **Review System**: Detailed star ratings and comments for every listing.
- **Favorites System**: Save your favorite stays to your profile (Persistent state).
- **Image Uploads**: Cloud-integrated image hosting using **Cloudinary**.
- **Interactive Maps**: Geospatial data visualization for property locations.
- **Responsive Design**: Pixel-perfect UI using **Bootstrap 5** and custom CSS, optimized for mobile and desktop.
- **Auto-Seeding**: The database automatically populates with sample data on its first deployment.

---

## 🚀 Tech Stack

### Frontend
- **EJS (Embedded JavaScript Templates)**: Dynamic server-side rendering.
- **Bootstrap 5**: Modern layout and components.
- **FontAwesome & Bootstrap Icons**: Premium iconography.
- **Vanilla JS**: Interactive frontend logic and filtering.

### Backend
- **Node.js & Express**: High-performance server environment.
- **MongoDB Atlas**: Robust cloud-based NoSQL database.
- **Mongoose**: Elegant Object Data Modeling (ODM).
- **Passport.js**: Secure authentication middleware.
- **Multer & Multer-Storage-Cloudinary**: Handling multipart/form-data for image uploads.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Chiranjeeb-Dash-Git/-Airbnb-Clone-Global-Stay-Network.git
cd -Airbnb-Clone-Global-Stay-Network
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory and add the following:
```env
MONGO_ATLAS_URL=your_mongodb_connection_string
SESSION_SECRET=a_very_secure_random_string
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
CLOUD_NAME=your_cloudinary_name
```

### 4. Run the Application
```bash
# Local development
nodemon app.js

# Production start
npm start
```

---

## 🌩️ Deployment Details

### **Database (MongoDB Atlas)**:
- Ensure **0.0.0.0/0** is allowed in the Network Access settings.
- The app automatically seeds listings if it detects an empty database.

### **Hosting (Render)**:
- **Build Command**: `npm install`
- **Start Command**: `node app.js`
- **Environment Variables**: Make sure to add all keys from your `.env` into the Render dashboard.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Open an **Issue** for bugs or feature requests.
- Submit a **Pull Request** for improvements.

---

## 📄 License
This project is licensed under the **ISC License**.

---

*Built with ❤️ by [Chiranjeeb-Dash-Git](https://github.com/Chiranjeeb-Dash-Git)*
