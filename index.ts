import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import multer from 'multer';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
require('dotenv').config();

// Create an instance of the Express application
const app = express();

// Configure middleware
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
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

const outDir = './out';
const cleanOutDirectory = async (dir: string) => {
    try {
        const files = await fs.promises.readdir(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            try {
                await fs.promises.rm(filePath, { recursive: true, force: true });
                console.log(`Deleted: ${filePath}`);
            } catch (err) {
                if (err instanceof Error) {
                    console.error(`Error deleting ${filePath}: ${err.message}`);
                } else {
                    console.error(`Unknown error deleting ${filePath}`);
                }
            }
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Error reading '${dir}' directory: ${err.message}`);
        } else {
            console.error(`Unknown error reading '${dir}' directory`);
        }
    }
};

app.post('/upload/solidity', upload.single('file'), (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
        const filePath = path.join(uploadDir, req.file.originalname);
        const fileNameWithoutExtension = req.file.originalname.replace(/\.[^/.]+$/, "");

        const { privateKey, rpcUrl } = req.body;

        const forgeCommand = `forge create ${filePath}:${fileNameWithoutExtension} --rpc-url ${rpcUrl} --private-key ${privateKey}`;

        exec(forgeCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error.message}`);
                res.status(500).send(`Error executing command: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`Error output: ${stderr}`);
                res.status(500).send(`Command failed: ${stderr}`);
                return;
            }

            res.send(`Command output: ${stdout}`);

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err.message}`);
                } else {
                    console.log(`File ${filePath} deleted successfully`);
                }
            });

            cleanOutDirectory(outDir);
        });
    } else {
        res.status(400).send('No file uploaded or file is not .sol');
    }
});
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err.message === 'File uploaded must be .sol') {
        res.status(400).send('File uploaded must be .sol');
    } else {
        res.status(500).send('An internal server error occurred');
    }
    next(err);
};
app.use(errorHandler);

let port = process.env.PORT || 3000;
app.listen(3000, '0.0.0.0', () => {
    console.log(`Server is listening on port ${port}`);
});
