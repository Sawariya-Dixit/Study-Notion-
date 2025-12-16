const express = require("express");
const router = express.Router();

const {
    createSubSection,
    updateSubSection,
    deleteSubSection
    
} = require("../controllers/SubSection");

const { auth, isInstructor } = require("../middelwares/auth");

// CREATE SubSection
router.post("/create", auth, isInstructor, createSubSection);
router.put("/update", auth, isInstructor, updateSubSection);
router.delete("/delete", auth, isInstructor, deleteSubSection);

module.exports = router;
