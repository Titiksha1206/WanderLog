import multer from "multer";
import path from "path";

// storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); //destination folder for storing uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); //unique filename
    },
});

// filefilter to accept only images
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")){
        cb(null, true);
    }
    else{
    cb(new Error('Only image files are allowed!'), false);
    }
};

export const upload = multer({storage, fileFilter})