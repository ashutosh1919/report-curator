import * as apiOps from './api';

export async function getViewers(octokit: any, owner: string, repository: string): Promise<any> {
    return await apiOps.getGitResponseV3(octokit,
        `GET /repos/${owner}/${repository}/traffic/views`);
}

export async function getCloners(octokit: any, owner: string, repository: string): Promise<any> {
    return await apiOps.getGitResponseV3(octokit,
        `GET /repos/${owner}/${repository}/traffic/clones`);
}