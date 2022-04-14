import * as core from '@actions/core';
import { exec as execUtil, ExecOptions } from '@actions/exec';
import SemVer from 'semver/classes/semver';

async function run(): Promise<void> {
    try {
        const currentVersion: string = await exec('npm', ['pkg', 'get', 'version']);

        const semver: SemVer = new SemVer(currentVersion);
        const newVersion: SemVer = semver.inc('prepatch');

        const newVersionStr: string = newVersion.format();
        const newVersionAlpha: string = `${newVersionStr.substring(0, newVersionStr.length - 2)}-alpha`;

        await exec('npm', ['version', newVersionAlpha, '--no-git-tag-version']);

        core.setOutput('new-version', newVersionAlpha);
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

