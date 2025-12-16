const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
  try {
    const options = { folder, resource_type: "auto" };
    if (height) options.height = height;
    if (quality) options.quality = quality;

    let fileData;

    // If multer memoryStorage, file.buffer exists
    if (file.buffer) {
      fileData = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
    } else if (file.path) {
      // if multer diskStorage, use file.path
      fileData = file.path;
    } else if (file.tempFilePath) {
      // for express-fileupload
      fileData = file.tempFilePath;
    } else {
      throw new Error("No valid file data found for Cloudinary upload");
    }

    const result = await cloudinary.uploader.upload(fileData, options);
    return result;

  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
};
