const Profile = require("../models/Profile");
const { convertSecondsToDuration } = require("../utills/secToDuration")
const User = require('../models/User');
const { uploadImageToCloudinary } = require("../utills/imageUploader")
const Course = require("../models/Course")
const CourseProgress = require("../models/CourseProgress")
const bcrypt = require("bcrypt");  // ya import bcrypt from "bcrypt"; agar ES Modules use ho rahe ho

exports.updateProfile = async (req, res) => {
  try {
    const { 
      firstName,
      lastName,
      dateOfBirth = "", 
      about = "", 
      contactNumber, 
      gender 
    } = req.body;

    const id = req.user.id;

    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Update USER model fields
    const user = await User.findById(id);
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    await user.save();

    // Update PROFILE model fields
    const profile = await Profile.findById(user.additionalDetails);
    profile.dateOfBirth = dateOfBirth;
    profile.about = about;
    profile.gender = gender;
    profile.contactNumber = contactNumber;
    await profile.save();

    // Return updated data (with populated details)
    const updatedUser = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Delete profile
        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        // Delete user
        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'User could not be deleted',
        });
    }
};


// get all userDetails 

exports.getAllUserDetails = async (req, res) => {
    try {
        // Get user ID from JWT
        const id = req.user.id;

        // Fetch user + populated profile
        const userDetails = await User.findById(id)
            .populate("additionalDetails")
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
  console.log(req.body);
 

  try {
    if (!req.files || !req.files.displayPicture) {
      console.log(" No file received")
      return res.status(400).json({ success: false, message: "No file" })
    }

    const displayPicture = req.files.displayPicture
    const userId = req.user.id

    console.log(" UPLOADING TO CLOUDINARY...", displayPicture.name)

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )



    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )

    console.log("UPDATED USER → ", updatedProfile)

    res.status(200).json({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    console.log(" BACKEND ERROR → ", error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id

    let userDetails = await User.findById(userId)
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "SubSection", 
          },
        },
      })
      .exec()

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      })
    }

    userDetails = userDetails.toObject()

    for (let i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      let SubsectionLength = 0

    for (let j = 0; j < userDetails.courses[i].courseContent.length; j++) {
  

  const subSections =
    userDetails.courses[i].courseContent[j].SubSection || []
//     console.log(
//   "timeDuration:",
//   userDetails.courses[i].courseContent[j].SubSection[0]
// )

const getSeconds = (time) => {
  if (!time) return 0
  const match = time.match(/\d+/)
  return match ? Number(match[0]) : 0
}

 totalDurationInSeconds += subSections.reduce(
  (acc, curr) => acc + getSeconds(curr.timeDuration),
  0
)


  SubsectionLength += subSections.length
}


      userDetails.courses[i].totalDuration =
        convertSecondsToDuration(totalDurationInSeconds)

     const courseProgress = await CourseProgress.findOne({
  courseId: userDetails.courses[i]._id,
  userId: userId,
})

const completedCount = courseProgress?.completedVideo?.length || 0

userDetails.courses[i].progressPercentage =
  SubsectionLength === 0
    ? 100
    : Math.round((completedCount / SubsectionLength) * 100)

    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    console.error("GET ENROLLED COURSES ERROR:", error)
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}


exports.instructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Fetch courses created by instructor
    const courses = await Course.find({ instructor: instructorId });

    // Calculate total students and income
    const coursesData = courses.map((course) => ({
      courseName: course.name,
      totalStudentsEnrolled: course.studentsEnrolled.length,
      totalAmountGenerated: course.studentsEnrolled.length * course.price,
    }));

    res.status(200).json({ success: true, courses: coursesData });
  } catch (error) {
    console.error("INSTRUCTOR DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.findByIdAndUpdate(req.user.id, {
      password: hashedPassword,
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.log("CHANGE PASSWORD ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Could not change password",
    });
  }
};
