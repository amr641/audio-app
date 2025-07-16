import multer, { diskStorage } from "multer";
import { join, extname } from "path";
import { mkdirSync } from "fs";

// File filters
const audioTypes = [".mp3", ".m4a"];
const imageTypes = [".jpg", ".jpeg", ".png"];

// Multer Storage Configuration
const storage = diskStorage({
    destination: function (req, file, cb) {
        const userId = req.user?.userId?.toString() || "anonymous";
        let subFolder = "others";

        if (file.fieldname === "audioFile") {
            subFolder = `audio/user_${userId}`;
        } else if (file.fieldname === "profile") {
            subFolder = `profiles/user_${userId}`;
        }

        const folderPath = join("uploads", subFolder);
        mkdirSync(folderPath, { recursive: true });
        cb(null, folderPath);
    },
    filename: function (req, file, cb) {
        const ext = extname(file.originalname);
        const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
        cb(null, name);
    },
});

// File filter: Only allow certain types
const fileFilter = function (req, file, cb) {
    const ext = extname(file.originalname).toLowerCase();

    if (file.fieldname === "audioFile" && audioTypes.includes(ext)) {
        cb(null, true);
    } else if ((file.fieldname === "cover" || file.fieldname === "profile") && imageTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error("File type not allowed"), false);
    }
};

// File size limits
const limits = {
    fileSize: 50 * 1024 * 1024, // max 50MB per file
};

const upload = multer({
    storage,
    fileFilter,
    limits,
});

export default upload;