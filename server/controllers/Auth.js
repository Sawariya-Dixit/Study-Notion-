const otpTemplate = require("../mail/templates/emailVerificationTemplate");
const mailSender = require("../utills/mailSender");
const User = require('../models/User');
const OTP = require("../models/Otp");
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
require("dotenv").config();
const Profile = require("../models/Profile");


//* send otp 


exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already registered'
            });
        }

        // generate otp
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });

        let isOtpPresent = await OTP.findOne({ otp });

        while (isOtpPresent) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            isOtpPresent = await OTP.findOne({ otp });
        }

      const otpDoc =   await OTP.create({ email, otp });
        console.log(otpDoc);
        // await mailSender(
        //     email,
        //     "StudyNotion OTP Verification",
        //     otpTemplate(otp)
        // );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully",
         
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



//* sign up
exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

        if (recentOtp.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found'
            });
        }

        if (otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        await OTP.deleteMany({ email });

        const hashedPassword = await bcrypt.hash(password, 10);

        const profile = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profile._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`
        });

        return res.status(200).json({
            success: true,
            message: 'User registered successfully',
            user,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error in signup'
        });
    }
};




//* Login

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not registered'
            });
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.status(401).json({
                success: false,
                message: 'Incorrect password'
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "24h"
        });

        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: true,        //HTTPS ke liye (Vercel)
            sameSite: "None"
        };

        return res.cookie("token", token, options)
            .status(200)
            .json({
                success: true,
                token,
                user,
                message: "Logged in successfully"
            });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};
