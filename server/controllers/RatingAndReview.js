const mongoose = require("mongoose");
const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');

// Create Rating 
exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { rating, review, courseId } = req.body;
        
        if (!rating || rating < 1 || rating > 5) {
  return res.status(400).json({
    success: false,
    message: "Rating must be between 1 and 5",
  });
}


        // Check if user is enrolled in the course
        const courseDetails = await Course.findOne(
            { _id: courseId, studentsEnrolled: userId }
        );

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Student is not enrolled in the course',
            });
        }

        // Check if already reviewed
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });

        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: 'Course is already reviewed by the user',
            });
        }

        // Create rating
        const ratingReview = await RatingAndReview.create({
            rating,
            review,
            course: courseId,
            user: userId,
        });

        // Save review in course
        await Course.findByIdAndUpdate(
            courseId,
            {
                $push: { ratingAndReviews: ratingReview._id },
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Rating and Review created successfully",
            ratingReview,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get Average Rating
exports.getAverageRating = async (req, res) => {
    try {
        const courseId = req.body.courseId;

        const result = await RatingAndReview.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            averageRating: result.length > 0 ? result[0].averageRating : 0,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// Get All Ratings
exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image",
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetched successfully",
            data: allReviews,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
