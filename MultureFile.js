const multer = require("multer");

// Image configuration
const imgConfig = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}.${file.originalname}`);
    }
});

// Gallery images configuration
const galleryConfig = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, `gallery-${Date.now()}.${file.originalname}`);
    }
});

// Image filter
const isImage = (req, file, callback) => {
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    } else {
        callback(new Error("Only images are allowed"));
    }
};

// Gallery images filter
const isGalleryImage = (req, file, callback) => {
    if (file.mimetype.startsWith("galleryImages")) {
        callback(null, true);
    } else {
        callback(new Error("Only images are allowed for galleryImages"));
    }
};

// Image upload
const uploadImage = multer({
    storage: imgConfig,
    fileFilter: isImage
}).single("image");

// Gallery images upload
const uploadGalleryImages = multer({
    storage: galleryConfig,
    fileFilter: isGalleryImage
}).array("galleryImages"); // Adjust the array limit as needed

module.exports = { uploadImage, uploadGalleryImages };
