const Course = require("../models/Course")
const User = require("../models/User")
const CourseProgress = require("../models/CourseProgress")

exports.enrollCourseWithoutPayment = async (req, res) => {
 // console.log("enrollwithoutpayment", req.body)

  try {
    const { courseId } = req.body
    const userId = req.user.id

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      })
    }

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      })
    }

    // Already enrolled
    if (course.studentsEnrolled.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled",
      })
    }

    // Enroll user
    await Course.findByIdAndUpdate(courseId, {
      $push: { studentsEnrolled: userId },
    })

    await User.findByIdAndUpdate(userId, {
      $push: { courses: courseId },
    })

    //  CREATE COURSE PROGRESS (MOST IMPORTANT)
    await CourseProgress.create({
      courseId: courseId,
      userId: userId,
      completedVideo: [],
    })
    

    return res.status(200).json({
      success: true,
      message: "Course enrolled successfully (No Payment)",
      CourseProgress,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Enrollment failed",
    })
  }
}
