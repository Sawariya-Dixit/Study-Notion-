const express = require('express');
const router = express.Router();

const{createSection , updateSection , deleteSection} = require("../controllers/Section");
const{auth , isInstructor} = require('../middelwares/auth');
router.post("/createSection", auth , isInstructor,createSection);
router.put("/updateSection", auth , isInstructor, updateSection);
router.post("/deleteSection", auth , isInstructor, deleteSection);



module.exports = router;