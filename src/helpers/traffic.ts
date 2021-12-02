import { Octokit } from "octokit";
// import * as dotenv from 'dotenv';

// dotenv.config();

const v3Headers = {
    "access-control-allow-origin": "*",
    "accept": "application/vnd.github.v3+json"
}

export async function getViewers(authToken: string, owner: string, repository: string): Promise<any> {
    const octokit = new Octokit({ auth: authToken });
    return await octokit.request(`GET /repos/${owner}/${repository}/traffic/views`, {
        header: JSON.stringify(v3Headers)
    });
}

export async function getCloners(authToken: string): Promise<any> {
    const octokit = new Octokit({ auth: authToken });
    return await octokit.request("GET /repos/ashutosh1919/masterPortfolio/traffic/clones")
}