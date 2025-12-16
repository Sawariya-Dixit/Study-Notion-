const express = require("express");
const router = express.Router();

const { auth, isStudent } = require('../middelwares/auth');

const {
    createRating,
    getAverageRating,
    getAllRating
} = require("../controllers/RatingAndReview");

// Add Rating & Review
router.post("/create", auth, isStudent, createRating);

// Get Average Rating for a Course
router.post("/average", getAverageRating);

// Get All Reviews (public)
router.get("/all", getAllRating);

module.exports = router;
