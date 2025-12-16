const Course = require("../models/Course")
const Category = require("../models/Category")
const Section = require("../models/Section")
const SubSection = require("../models/SubSection")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utills/imageUploader")
const CourseProgress = require("../models/CourseProgress")
const { convertSecondsToDuration } = require("../utills/secToDuration")
// Function to create a new course
exports.createCourse = async (req, res) => {


  try {
    const userId = req.user.id;

    //  Get all required fields from request body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      tags,
      category,
      status,
      instructions,
    } = req.body;

    if (typeof tags === "string") tags = JSON.parse(tags);
    if (typeof instructions === "string") instructions = JSON.parse(instructions);
    console.log("Step 2: Parsed tags and instructions");

    const thumbnail = req.files?.thumbnail;
    console.log(" Step 3: thumbnail:", thumbnail ? "exists" : "missing");

    //  Validate required fields
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tags?.length ||
      !thumbnail ||
      !category ||
      !instructions?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Mandatory",
      });
    }

    if (!status) status = "Draft";

    //  Check if the user is an instructor
    const instructorDetails = await User.findById(userId);
    if (!instructorDetails || instructorDetails.accountType !== "Instructor") {
      return res.status(403).json({ success: false, message: "Not an instructor" });
    }

    //  Check if category exists
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      });
    }

    //  Upload thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //  Create the new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn,
      price,
      tags, 
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
      status,
      instructions,  
    });

    // 9️ Add course to instructor's courses
    await User.findByIdAndUpdate(
      instructorDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // 10️ Add course to category's courses
    await Category.findByIdAndUpdate(
      categoryDetails._id,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // 1Respond with success
    res.status(200).json({
      success: true,
      data: newCourse,
      message: "Course Created Successfully",
    });
  } catch (error) {
    console.error("Create Course Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// Edit Course Details
// Edit Course Details
exports.editCourse = async (req, res) => {
  console.log("REQ BODY:", req.body);
console.log("REQ FILES:", req.files);

  try {
    const courseId = req.body.courseId;
    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID is required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Handle thumbnail upload
    if (req.files && req.files.thumbnailImage) {
      const thumbnailImage = await uploadImageToCloudinary(
        req.files.thumbnailImage,
        process.env.FOLDER_NAME || "courses"
      );
      course.thumbnail = thumbnailImage.secure_url;
    }


    const updates = Object.keys(req.body).filter((key) => key !== "courseId");

    updates.forEach((key) => {
      // tags and instructions are sent as JSON strings
      if (key === "tag" || key === "instructions") {
        course[key] = JSON.parse(req.body[key]);
      } else {
        course[key] = req.body[key];
      }
    });

    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("EDIT COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Course List
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    )
      .populate("instructor")
      .exec()

    return res.status(200).json({
      success: true,
      data: allCourses,
    })
  } catch (error) {
    console.log(error)
    return res.status(404).json({
      success: false,
      message: `Can't Fetch Course Data`,
      error: error.message,
    })
  }
}


exports.getCourseDetails = async (req, res) => {
  console.log(req.body);
  try {
    const { courseId } = req.body
    if(!courseId){
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      })
    }
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }
let totalDurationInSeconds = 0
courseDetails.courseContent?.forEach(content => {
  content.subSection?.forEach(sub => {
    totalDurationInSeconds += parseInt(sub.timeDuration || 0)
  })
})

const totalDuration = convertSecondsToDuration(totalDurationInSeconds)

return res.status(200).json({
  success:true,
  data:courseDetails,
  totalDuration

})

  } catch (error) {
     console.log("Cannot fetch the error",error);
      return res.status(500).json({

      success: false,
      message: error.message,
    })
  }
}
exports.getFullCourseDetails = async (req, res) => {
  console.log("full course details", req.body);

  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    const courseDetails = await Course.findById(courseId)
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "SubSection" },
      });

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

   // Allow instructor access
//  Enrollment OR Instructor check
const isInstructor =
  courseDetails.instructor._id.toString() === userId;

const isStudentEnrolled =
  courseDetails.studentsEnrolled
    .map(id => id.toString())
    .includes(userId);

if (!isInstructor && !isStudentEnrolled) {
  return res.status(403).json({
    success: false,
    message: "User not enrolled in this course",
  });
}



    const courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    console.log("courseProgressCount:", courseProgress);

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.SubSection.forEach((sub) => {
        totalDurationInSeconds += parseInt(sub.timeDuration || 0);
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideo: courseProgress?.completedVideo || [],
      },
    });

  } catch (error) {
    console.error("getFullCourseDetails error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  console.log(req.body)
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 })

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    })
  }
}
// Delete the Course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body

    // Find the course
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Unenroll students from the course
const studentsEnrolled = course.studentsEnrolled
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      })
    }

    // Delete sections and sub-sections
    const courseSections = course.courseContent
    for (const sectionId of courseSections) {
      // Delete sub-sections of the section
      const section = await Section.findById(sectionId)
      if (section) {
        const subSections = section.SubSection
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId)
        }

      }

      // Delete the section
      await Section.findByIdAndDelete(sectionId)
    }

    // Delete the course
    await Course.findByIdAndDelete(courseId)

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    })
  }
}