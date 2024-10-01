import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export const buildMove = async (moduleName: string, accAddr: string): Promise<{ stdout: string, stderr: string }> => {
    const moveCommand = `aptos move compile --named-addresses ${moduleName}="${accAddr}"`;

    console.log(`Building Move module: ${moveCommand}`);

    const { stdout, stderr } = await execPromise(moveCommand);
    return { stdout, stderr };
};
