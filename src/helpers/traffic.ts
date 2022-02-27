import { Octokit } from 'octokit';

import {
    ViewersResponse,
    ClonersResponse
} from '../types'

export async function getViewers(octokit: Octokit, owner: string, repository: string): Promise<ViewersResponse> {
    return await octokit.request(
        `GET /repos/${owner}/${repository}/traffic/views`
    )
}

export async function getCloners(octokit: Octokit, owner: string, repository: string): Promise<ClonersResponse> {
    return await octokit.request(
        `GET /repos/${owner}/${repository}/traffic/clones`
    )
}