import { Octokit } from "octokit";
// import * as dotenv from 'dotenv';

// dotenv.config();

export async function getViewers(authToken: string): Promise<any> {
    const octokit = new Octokit({ auth: authToken });
    return await octokit.request("GET /repos/ashutosh1919/masterPortfolio/traffic/views");
}

export async function getCloners(authToken: string): Promise<any> {
    const octokit = new Octokit({ auth: authToken });
    return await octokit.request("GET /repos/ashutosh1919/masterPortfolio/traffic/clones")
}