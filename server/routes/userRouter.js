import {loginUser, registerUser} from '../controllers/UserController.js';
import {Router} from "express";

const userRouter = Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);

export {userRouter};