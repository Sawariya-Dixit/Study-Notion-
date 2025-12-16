const express = require("express");
const router = express.Router();

const { sendOTP, signUp, login } = require("../controllers/Auth");
const{resetPassword , resetPasswordToken }= require('../controllers/ResetPassword');


// Auth routes
router.post("/sendotp", sendOTP);
router.post("/signup", signUp);
router.post("/login", login);

//reset password routes

router.post("/reset-password-token",resetPasswordToken);
router.post("/reset-password", resetPassword);



module.exports = router;
