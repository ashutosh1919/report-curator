import { v3Headers } from './constants';

export async function getGitResponseV3(octokit: any, url: string, headers: object = v3Headers): Promise<any>{
    return await octokit.request(url, {
        header: JSON.stringify(headers)
    });
}

export function getGitBranchesV3(
        octokit: any,
        owner: string,
        repository: string): Promise<any> {
    return getGitResponseV3(octokit,
        `GET /repos/${owner}/${repository}/branches`);
}

export function getBranchRefV3(
        octokit: any,
        owner: string,
        repository: string,
        branch: string): Promise<any> {
    return getGitResponseV3(octokit,
        `GET /repos/${owner}/${repository}/git/ref/heads/${branch}`);
}

export async function createBranchRefV3(
        octokit: any,
        owner: string,
        repository: string,
        refBranch: string,
        baseSHA: string
        ): Promise<any> {
    return await octokit.request(
        `POST /repos/${owner}/${repository}/git/refs`,
        {
            ref: `refs/heads/${refBranch}`,
            sha: baseSHA
        }
    );
}
