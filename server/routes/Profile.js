const express = require('express');
const router = express.Router();

const { auth } = require("../middelwares/auth");

const { 
    updateProfile,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    changePassword,
    instructorDashboard,
    getEnrolledCourses
} = require('../controllers/Profile');

// EXISTING
router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);

router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.post("/changepassword", auth, changePassword);

router.get("/instructorDashboard", auth, instructorDashboard);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

module.exports = router;
