const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utills/imageUploader");

// ======================= CREATE SUBSECTION ============================
exports.createSubSection = async (req, res) => {
  try {
    // console.log("BODY:", req.body);
    // console.log("FILES:", req.files);

    const { sectionId, title, description } = req.body;

    // Validate required fields
    if (!sectionId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Extract video from req.files
    if (!req.files || !req.files.video) {
      return res.status(400).json({
        success: false,
        message: "Video file is required",
      });
    }

    const video = req.files.video;

    // Upload to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // Create SubSection
    const subSection = await SubSection.create({
      title,
      description,
      timeDuration: `${Math.floor(uploadDetails.duration)} seconds`,
      videoUrl: uploadDetails.secure_url,
    });

    // Add SubSection to Section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { SubSection: subSection._id } },
      { new: true }
    ).populate("SubSection");

    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ======================= UPDATE SUBSECTION ============================
exports.updateSubSection = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("FILES:", req.files);

  try {
    const { subSectionId, title, description } = req.body;

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      });
    }

    if (title) subSection.title = title;
    if (description) subSection.description = description;

    // IMPORTANT: match frontend field name
   if (req.files && req.files.video) {
    const uploadDetails = await uploadImageToCloudinary(
      req.files.video,
      process.env.FOLDER_NAME
    );
    subSection.videoUrl = uploadDetails.secure_url;
    subSection.timeDuration = `${Math.floor(uploadDetails.duration)} seconds`;
}


    await subSection.save();

    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      data: subSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};


// ======================= DELETE SUBSECTION ============================
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body;

    await Section.findByIdAndUpdate(sectionId, {
      $pull: { SubSection: subSectionId },
    });

    await SubSection.findByIdAndDelete(subSectionId);

    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
