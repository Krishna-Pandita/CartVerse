import express from 'express';
import { allUser, changePassword, forgotPassword, getUserById, login, logout, register, updateUser, verifyOTP } from '../controllers/userController.js';
import { verify } from '../controllers/userController.js';
import { reVerify } from '../controllers/userController.js';
import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
import { singleUpload } from '../middleware/multer.js';


const router = express.Router();

router.post('/register', register);
router.post('/verify', verify);
router.post('/reverify', reVerify);
router.post('/login', login);
router.post('/logout', isAuthenticated, logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp/:email', verifyOTP);
router.post('/change-password/:email', changePassword);
router.get('/all-users', isAuthenticated, isAdmin, allUser);              //Added Routes
router.get('/get-user/:userId', getUserById);  
router.put('/update/:id', isAuthenticated, singleUpload, updateUser);  // Added route for profile update





export default router;


