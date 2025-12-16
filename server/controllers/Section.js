const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

// ------------------------------------------------------------
// CREATE SECTION
// ------------------------------------------------------------
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    // 1️ Find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the course creator can create sections",
      });
    }

    //  Create section
    const newSection = await Section.create({ sectionName });

    // Add to course
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    )
      .populate({
  path: "courseContent",
  populate: {
    path: "SubSection",
  },
}).exec();

    return res.status(200).json({
      success: true,
      message: "Section created Successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "section creation error",
      error: error.message,
    });
  }
};

// ------------------------------------------------------------
// UPDATE SECTION
// ------------------------------------------------------------
exports.updateSection = async (req, res) => {
  console.log(req.body);
  try {
    const { sectionName, sectionId } = req.body;

    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      });
    }

    //  Find section
    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    //  Find course containing this section
    const course = await Course.findOne({ courseContent: sectionId });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found for this section",
      });
    }

    //  Ownership check
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only the course creator can update this section",
      });
    }

    // Update section
    const updated = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section updated Successfully",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update Section",
      error: error.message,
    });
  }
};

// ------------------------------------------------------------
// DELETE SECTION
// ------------------------------------------------------------
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    const section = await Section.findById(sectionId);

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not Found",
      });
    }

    // ❗ FIXED: Use correct field name (SubSection)
    await SubSection.deleteMany({ _id: { $in: section.SubSection } });

    await Section.findByIdAndDelete(sectionId);

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "SubSection" }
      })
      .exec();

    res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
