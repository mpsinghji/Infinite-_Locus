import express from 'express';
import {loginUser, registerUser, getMe, logoutUser} from '../controllers/authController.js';
import { authUser } from '../middleware/authUser.js';

const userRouter = express.Router();

userRouter.post('/signup',registerUser);
userRouter.post('/login',loginUser);
userRouter.get('/me', authUser, getMe);
userRouter.post('/logout', authUser, logoutUser);

export default userRouter;