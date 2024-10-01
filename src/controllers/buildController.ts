import { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export const buildMove = async (moduleName: string, accAddr: string): Promise<{ stdout: string, stderr: string }> => {
    const moveCommand = `aptos move compile --named-addresses ${moduleName}="${accAddr}"`;

    console.log(`Building Move module: ${moveCommand}`);

    try {
        const { stdout, stderr } = await execPromise(moveCommand);
        return { stdout, stderr };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Error executing command: ${error.message}`);
        } else {
            console.error('An unknown error occurred');
        }
        throw error;
    }
};
