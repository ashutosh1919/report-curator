import { Octokit } from 'octokit';
import * as repOps from './repository';
import * as apiOps from './api';

import { 
    ActionSecret,
    GitBranchesV3Response
} from '../types';

function getOctokitContext(authToken: string): Octokit {
    return new Octokit({ auth: authToken });
}

export async function getActionSecrets(authToken: string, payload: object): Promise<ActionSecret> {
    const owner: string = repOps.getRepositoryOwner(payload);
    const repository: string = repOps.getRepositoryName(payload);
    const branch: string = repOps.getCurrentBranchName(payload);
    const octokit: Octokit = getOctokitContext(authToken);
    const branches: GitBranchesV3Response = await apiOps.getGitBranchesV3(octokit, owner, repository);
    return { 
        octokit: octokit,
        owner: owner,
        repository: repository,
        branch: branch,
        branches: branches["data"]
    };
}