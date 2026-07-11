# 🛒 CartVerse

A modern **Full-Stack MERN E-Commerce Web Application** built using **MongoDB, Express.js, React, and Node.js**. CartVerse provides a seamless online shopping experience with secure authentication, Razorpay payment integration, Cloudinary image uploads, email verification, and an admin dashboard for managing products and orders.

---

## 🌐 Live Demo

**Frontend:** https://your-frontend-url.vercel.app

**Backend API:** https://your-backend-url.onrender.com

> Replace the above URLs after deployment.

---

## 📸 Screenshots

### 🏠 Home Page

![Home](./screenshots/home.png)

### 📦 Product Details

![Product](./screenshots/product.png)

### 🛒 Cart

![Cart](./screenshots/cart.png)

### 💳 Checkout

![Checkout](./screenshots/checkout.png)

### 👨‍💼 Admin Dashboard

![Admin](./screenshots/admin.png)

---

# ✨ Features

## 👤 Authentication

- JWT Authentication
- Secure Password Hashing using bcrypt
- Email Verification
- Protected Routes
- User Login & Registration

---

## 🛍️ Shopping

- Browse Products
- Search Products
- Product Details
- Shopping Cart
- Quantity Management
- Order Summary

---

## 💳 Payments

- Razorpay Payment Gateway
- Secure Checkout
- Order Placement
- Payment Verification

---

## 📦 Orders

- Place Orders
- View Order History
- Track Purchased Products

---

## 👨‍💼 Admin Panel

- Add Products
- Edit Products
- Delete Products
- Upload Images
- Manage Orders
- View Sales Analytics

---

## ☁️ Cloud Services

- Cloudinary Image Upload
- MongoDB Atlas Database
- Nodemailer Email Service

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- shadcn/ui
- Axios

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Nodemailer
- Razorpay
- Cloudinary

---

# 📁 Folder Structure

```
CartVerse
│
├── backend
│   ├── config
│   ├── controllers
│   ├── database
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   ├── emailVerify
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── redux
│   │   ├── assets
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Before running this project, make sure you have installed:

- Node.js (v18 or above)
- npm
- MongoDB Atlas or Local MongoDB
- Cloudinary Account
- Razorpay Account

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/Krishna-Pandita/CartVerse.git
```

```bash
cd CartVerse
```

---

## Install Backend

```bash
cd backend
npm install
```

---

## Install Frontend

```bash
cd ../frontend
npm install
```

---


# 🔐 Environment Variables

Create a `.env` file inside the **backend** folder.

```env

PORT

MONGO_URI

JWT_SECRET

CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET

EMAIL_USER
EMAIL_PASS
```

---

# ▶️ Run Project

## Backend

```bash
cd backend
npm start
```


## Frontend

```bash
cd frontend
npm run dev
```

---

# 📡 API Modules

The backend includes REST APIs for:

- Authentication
- Products
- Cart
- Orders
- Admin Management

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- Role-Based Authorization
- Secure Environment Variables

---

# 📱 Responsive Design

Fully responsive for

- Desktop
- Tablet
- Mobile

---

# ☁️ Deployment

| Service  |      Platform |
|----------|---------------|
| Frontend |      Vercel   |
| Backend  |       Render   |
| Database |      MongoDB Atlas |
| Image Storage | Cloudinary |

---

# 🚀 Future Improvements

- Wishlist
- Product Reviews & Ratings
- Coupons & Discounts
- Inventory Management
- Order Tracking
- Multi-language Support
- Dark Mode
- Docker Support
- Progressive Web App (PWA)

---


# 👨‍💻 Author

**Krishna Pandita**

GitHub: https://github.com/yourusername

LinkedIn: https://linkedin.com/in/yourusername

Portfolio: https://yourportfolio.com

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---
