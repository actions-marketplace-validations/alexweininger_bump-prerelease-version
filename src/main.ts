import * as core from '@actions/core';
import { exec as execUtil, ExecOptions } from '@actions/exec';

async function run(): Promise<void> {
    try {
        const currentVersion: string = (await exec('npm', ['pkg', 'get', 'version'])).replace(/['"]+/g, '');
        core.setOutput('old-version', currentVersion);
        const output = await exec('npm', ['version', 'prerelease', '--no-git-tag-version', '--preid', 'alpha']);
        core.setOutput('new-version', output);
    } catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}

run();


async function exec(command: string, args?: string[], opts?: ExecOptions): Promise<string> {
    let output: string = '';
    let error: string = '';

    const options: ExecOptions = {
        listeners: {
            stdout: (data: Buffer) => {
                output += data.toString();
            },
            stderr: (data: Buffer) => {
                error += data.toString();
            }
        },
        ...opts
    };

    await execUtil(command, args, options);

    if (error !== '') {
        throw new Error(error);
    }
    return output;
}

