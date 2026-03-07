import multer from "multer";
import fs from "fs";

/* Ensure folder exists */

const uploadPath = "uploads/videos";

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* Storage */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const fileName = `alert-${Date.now()}.webm`;
    cb(null, fileName);
  }
});

/* Allow only video files */

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "video/webm",
    "video/mp4",
    "video/ogg"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only video files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

export default upload;