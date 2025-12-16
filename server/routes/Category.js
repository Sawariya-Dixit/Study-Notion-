
const express= require('express');
const router = express.Router();

const {
    createCategory,
    showAllCategories,
    categoryPageDetails
} = require("../controllers/Category");

const{
    auth , isStudent ,isAdmin ,isInstructor
}
= require("../middelwares/auth")
// Create new category
router.post("/create", auth, createCategory);

// Show all categories
router.get("/all", showAllCategories);

// Get category page details
router.post("/details", categoryPageDetails);

module.exports = router;