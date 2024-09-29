import multer from 'multer';
import { Request } from 'express';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Folder to store uploaded files
    },
    filename: (req, file, cb) => {
        // Keep the original file name
        cb(null, file.originalname);
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (fileExtension === '.sol') {
        cb(null, true); // Accept file if it's a .sol file
    } else {
        cb(new Error('File uploaded must be .sol')); // Throw error if file type is not .sol
    }
};

const upload = multer({
    storage,
    fileFilter // Use fileFilter to filter file types
});

// Create uploads directory if not exists
const uploadDir = 'uploads';
const outDir = 'out';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

export { upload, uploadDir, outDir };
