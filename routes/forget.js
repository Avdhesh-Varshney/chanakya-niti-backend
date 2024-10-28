import express from 'express'
import forgetPoasswrd from '../controllers/forgetPassword.controller.js';
import { resetPassword } from '../controllers/resetPassword.controller.js';


 const router = express.Router();

router.post("/forgetpassword", forgetPoasswrd)
router.post("/reset-password/:token", resetPassword);


export default router ;