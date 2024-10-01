import { Request, Response, NextFunction } from 'express';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import { cleanOutDirectory } from '../services/fileService';
import { SolDir, outDir, moveDir, buildDir } from '../config/multerConfig';
import { deploySolidity, deployMove } from './deployController';
import { buildMove } from './buildController';

export const handleSolidity = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file && req.file.originalname.endsWith('.sol')) {
        const filePath = path.join(SolDir, req.file.originalname);
        const fileNameWithoutExtension = req.file.originalname.replace(/\.[^/.]+$/, "");

        const { privateKey, rpcUrl } = req.body;


        try {
            await deploySolidity(filePath, fileNameWithoutExtension, rpcUrl, privateKey, res);

            // Delete the file after successful deployment
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err.message}`);
                } else {
                    console.log(`File ${filePath} deleted successfully`);
                }
            });

            // Clean out the directory
            cleanOutDirectory(outDir);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Deployment failed: ${error.message}`);
                res.status(500).send(`Deployment failed: ${error.message}`);
            } else {
                console.error('An unknown error occurred during deployment');
                res.status(500).send('An unknown error occurred during deployment');
            }
        }

    } else {
        res.status(400).send('No file uploaded or file is not .sol');
    }
};

export const handleMove = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file && req.file.originalname.endsWith('.move')) {
        const filePath = path.join(moveDir, req.file.originalname);
        // const fileNameWithoutExtension = req.file.originalname.replace(/\.[^/.]+$/, "");

        const { privateKey, rpcUrl, moduleName, accAddr } = req.body;

        try {
            await buildMove(moduleName, accAddr);
            await deployMove(accAddr, privateKey, rpcUrl, moduleName, res);


            // Delete the file after successful deployment

            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file: ${err.message}`);
                } else {
                    console.log(`File ${filePath} deleted successfully`);
                }
            });

            console.log(`Cleaning out build directory: ${buildDir}`);
            // Clean out the directory
            cleanOutDirectory(buildDir);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Deployment failed: ${error.message}`);
                res.status(500).send(`Deployment failed: ${error.message}`);
            } else {
                console.error('An unknown error occurred during deployment');
                res.status(500).send('An unknown error occurred during deployment');
            }
        }

    } else {
        res.status(400).send('No file uploaded or file is not .move');
    }
};