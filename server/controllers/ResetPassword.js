
const User = require('../models/User');

const mailSender = require('../utills/mailSender');
const crypto = require("crypto");

const bcrypt = require('bcrypt')

exports.resetPasswordToken = async (req, res) => {
  try {
    const email = req.body.email;

    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({
        success: false,
        message: "Your email is not registered with us",
      });
    }

    // Generate token
   // resetPasswordToken function
const token = crypto.randomUUID();
// console.log("backand " , token) // ya crypto.randomBytes(20).toString("hex")

await User.findOneAndUpdate(
    { email },
    {
        token: token,
        resetPasswordExpires: Date.now() + 60 * 60 * 1000, // 1 hour for safety
    },
    { new: true }
);


    // Correct URL
    const url = `http://localhost:5173/update-password/${token}`;

    // SEND MAIL (correct syntax)
    await mailSender(
      email,
      "Password Reset Link",
      `Password Reset Link: ${url}`
    );

    return res.json({
      success: true,
      message: "Email sent successfully, please check email",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset pwd mail",
    });
  }
};


// reset Password

exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password not matching",
            });
        }

        // Find user by token
        const userDetails = await User.findOne({ token });

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Token is invalid",
            });
        }

        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token is expired, please regenerate your token",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update password and remove token fields
        await User.findOneAndUpdate(
            { token },
            {
                password: hashedPassword,
                token: null,
                resetPasswordExpires: null,
            },
            { new: true }
        );

        
        // await mailSender(
        //     userDetails.email,
        //     "Your Password Was Updated",
        //     passwordUpdatedTemplate(userDetails.email, userDetails.firstName)
        // );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    } catch (error) {
        console.log("RESET PASSWORD ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password",
        });
    }
};
