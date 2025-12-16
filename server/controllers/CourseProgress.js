const CourseProgress = require("../models/CourseProgress")
const SubSection = require("../models/SubSection")

exports.updateCourseProgress = async (req, res) => {
  

   try {

    console.log(req.body);
    const { courseId, subsectionId } = req.body
    const userId = req.user.id

    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "Invalid subsection",
      })
    }

    let courseProgress = await CourseProgress.findOne({
  courseId,
  userId,
});

if (!courseProgress) {
  courseProgress = await CourseProgress.create({
    courseId,
    userId,
    completedVideo: [],
  });
}

if (
  courseProgress.completedVideo
    .map((id) => id.toString())
    .includes(subsectionId)
) {
  return res.status(200).json({
    success: true,
    message: "Already completed",
  });
}

courseProgress.completedVideo.push(subsectionId);
await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture marked as completed",
      completedVideo: courseProgress.completedVideo,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
}
