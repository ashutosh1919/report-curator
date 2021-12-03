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
    let baseSHA: any = await apiOps.getBranchRefV3(octokit, owner, repository, branch);
    console.log("Base SHA");
    console.log(baseSHA);
    return { 
        octokit: octokit,
        owner: owner,
        repository: repository,
        branch: branch,
        baseSHA: baseSHA
    };
}