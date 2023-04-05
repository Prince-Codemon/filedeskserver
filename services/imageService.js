const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadFile = async (req) => {
  const url = await cloudinary.v2.uploader.upload(req.file.path, {
    folder: "filedesk/pdf",
    quality: 40,
  });

  return url.secure_url;
};

const deleteFile = async (url) => {
  const filePresent = url.split("/").pop().split(".")[0];
  if (filePresent) {
    await cloudinary.v2.uploader.destroy(`filedesk/pdf/${filePresent}`);
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
