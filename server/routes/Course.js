const express = require("express");
const router = express.Router();

// Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require('../middelwares/auth');

// Controllers
const {
  createCourse,
  editCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");
const { enrollCourseWithoutPayment } = require("../controllers/enrollCourseWithoutPayment");
const { updateCourseProgress } = require("../controllers/CourseProgress");





// ==========================
//      COURSE ROUTES
// ==========================

// Create Course (Instructor only)
router.post("/createCourse", auth, isInstructor, createCourse);

// Edit Course
router.put("/editCourse", auth, isInstructor, editCourse);

// Delete Course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse);

// Get All Published Courses
router.get("/getAllCourses", getAllCourses);

// Get course details (public)
router.post("/getCourseDetails", getCourseDetails);

// Get full course details (only students who enrolled)
router.post("/getFullCourseDetails", auth, getFullCourseDetails);

// Instructor → Get all courses created by them
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
router.post(
  "/enroll-course",
  auth,
  isStudent,
  enrollCourseWithoutPayment

)
router.post("/updateCourseProgress",auth,updateCourseProgress); 


module.exports = router;
