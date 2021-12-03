import { Octokit } from "octokit";
import { v3Headers } from './constants';

export async function getViewers(authToken: string, owner: string, repository: string): Promise<any> {
    const octokit = new Octokit({ auth: authToken });
    return await octokit.request(`GET /repos/${owner}/${repository}/traffic/views`, {
        header: JSON.stringify(v3Headers)
    });
}

export async function getCloners(authToken: string, owner: string, repository: string): Promise<any> {
    const octokit = new Octokit({ auth: authToken });
    return await octokit.request(`GET /repos/${owner}/${repository}/traffic/clones`, {
        header: JSON.stringify(v3Headers)
    });
}