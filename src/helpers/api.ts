import { v3Headers } from './constants';

export async function getGitResponseV3(octokit: any, url: string, headers: object = v3Headers): Promise<any>{
    return await octokit.request(url, {
        header: JSON.stringify(headers)
    });
}

export async function getBranchRefV3(octokit: any,
        owner: string,
        repository: string,
        branch: string): Promise<any> {
    return await octokit.git.getRef({
        owner,
        repository,
        ref: `heads/${branch}`,
    });
}