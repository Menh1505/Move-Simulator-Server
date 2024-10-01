import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import { cleanOutDirectory } from '../services/fileService';
import { uploadDir, outDir } from '../config/multerConfig';

export const uploadSolidity = (req: Request, res: Response, next: NextFunction) => {
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
};

export const uploadMove = (req: Request, res: Response, next: NextFunction) => {
    if (req.file && req.file.originalname.endsWith('.move')) {
        const filePath = path.join(uploadDir, req.file.originalname);
        const fileNameWithoutExtension = req.file.originalname.replace(/\.[^/.]+$/, "");

        const { privateKey, rpcUrl } = req.body;

        // Placeholder response
        res.send('Move file upload and deployment endpoint (implementation pending)');
    } else {
        res.status(400).send('No file uploaded or file is not .move');
    }
};