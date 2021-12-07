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

export async function getAllFilesFromBranchV3(
        octokit: any,
        owner: string,
        repository: string,
        ref: string): Promise<any> {
    return await octokit.request(
        `GET /repos/{owner}/{repo}/contents`,
        {
            owner: owner,
            repo: repository,
            ref: ref
        }
    );
}

export async function deleteFileFromBranchV3(
        octokit: any,
        owner: string,
        repository: string,
        path: string,
        sha: string,
        commitMessgae: string,
        branch: string): Promise<any> {
    return await octokit.request(
        `DELETE /repos/{owner}/{repo}/contents/{path}`,
        {
            owner: owner,
            repo: repository,
            path: path,
            sha: sha,
            message: commitMessgae,
            branch: branch
        }
    );
}

export async function createFileTreeV3(
        octokit: any,
        owner: string,
        repository: string,
        path: string,
        content: string,
        baseTree: string,
        mode: string = '100644',
        type: string = 'blob'): Promise<any> {
    return await octokit.request(
        `POST /repos/{owner}/{repo}/git/trees`,
        {
            owner: owner,
            repo: repository,
            tree: [
                {
                    path: path,
                    mode: mode,
                    type: type,
                    content: content,
                    base_tree: baseTree
                }
            ]
        }
    );
}

export async function createCommitV3(
        octokit: any,
        owner: string,
        repository: string,
        commitMessage: string,
        treeSHA: string): Promise<any> {
    return await octokit.request(
        `POST /repos/{owner}/{repo}/git/commits`,
        {
            owner: owner,
            repo: repository,
            message: commitMessage,
            tree: treeSHA
        }
    );
}

export async function updateReferenceV3(
        octokit: any,
        owner: string,
        repository: string,
        branch: string,
        sha: string,
        force: boolean): Promise<any> {
    return await octokit.request(
        `PATCH /repos/{owner}/{repo}/git/refs/heads/${branch}`,
        {
            owner: owner,
            repo: repository,
            sha: sha,
            force: force
        }
    );
}
