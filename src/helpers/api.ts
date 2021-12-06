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

export async function createFileBlobV3(
        octokit: any,
        owner: string,
        repository: string,
        content: string,
        encoding: string = 'utf8'): Promise<any> {
    return await octokit.request(
        `POST /repos/${owner}/${repository}/git/blobs`,
        {
            content: content,
            encoding: encoding
        }
    )
}

export async function createFileTreeV3(
        octokit: any,
        owner: string,
        repository: string,
        content: string): Promise<any> {
    return await octokit.request(
        `POST /repos/${owner}/${repository}/git/trees`,
        {
            tree: [{
                path: 'index.html',
                mode: '100644',
                type: 'blob',
                content: content
            }]
        }
    );
}

export async function putFileContentInBranchV3(
        octokit: any,
        owner: string,
        repository: string,
        path: string,
        content: string,
        commitMessgae: string,
        branch: string): Promise<any> {
    return await octokit.request(
        `PUT /repos/{owner}/{repo}/contents/{path}`,
        {
            owner: owner,
            repo: repository,
            path: path,
            content: content,
            message: commitMessgae,
            branch: branch
        }
    );
}

export async function deleteAllFilesFromBranchV3(
        octokit: any,
        owner: string,
        repository: string,
        path: string,
        commitMessgae: string,
        branch: string): Promise<any> {
    return await octokit.request(
        `DELETE /repos/{owner}/{repo}/contents/{path}`,
        {
            owner: owner,
            repo: repository,
            path: path,
            message: commitMessgae,
            branch: branch
        }
    );
}
