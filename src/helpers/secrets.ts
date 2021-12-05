import { Octokit } from 'octokit';
import * as repOps from './repository';
import * as apiOps from './api';

function getOctokitContext(authToken: string): any {
    return new Octokit({ auth: authToken });
}

export async function getActionSecrets(authToken: string, payload: object): Promise<any> {
    let owner: string = repOps.getRepositoryOwner(payload);
    let repository: string = repOps.getRepositoryName(payload);
    let branch: string = repOps.getCurrentBranchName(payload);
    let octokit: any = await getOctokitContext(authToken);
    let branches: any = await apiOps.getGitBranchesV3(octokit, owner, repository);
    return { 
        octokit: octokit,
        owner: owner,
        repository: repository,
        branch: branch,
        branches: branches["data"]
    };
}