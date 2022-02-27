import {
    OctokitResponse,
    Endpoints
} from '@octokit/types';


import { Octokit } from 'octokit';

export type ActionSecret = {
    octokit: Octokit;
    owner: string;
    repository: string;
    branch: string;
    branches: ListBranchesResponse["data"]
}

export type ListBranchesResponse = Endpoints["GET /repos/{owner}/{repo}/branches"]["response"];
export type TrafficViewResponse = Endpoints[`GET /repos/{owner}/{repo}/traffic/views`]["response"]
export type TrafficClonesResponse = Endpoints[`GET /repos/{owner}/{repo}/traffic/clones`]["response"]

export type GitBranchesV3Response = OctokitResponse<ListBranchesResponse["data"]>
export type ViewersResponse = OctokitResponse<TrafficViewResponse["data"]>
export type ClonersResponse = OctokitResponse<TrafficClonesResponse["data"]>
        
export type GitResponse = GitBranchesV3Response | ViewersResponse | ClonersResponse;
export type GR = OctokitResponse<ListBranchesResponse["data"]
    | TrafficClonesResponse["data"]
    | TrafficViewResponse["data"]>

//export type GitBranchesReponse = OctokitResponse<ListBranchesResponse["data"]>

type createTreeParams = Endpoints["POST /repos/{owner}/{repo}/git/trees"]["parameters"]
export type TreeType = createTreeParams["tree"][0]
//export type TreeType = Pick<createTreeParams, "tree">
export type CreateTreeResponse = Endpoints["POST /repos/{owner}/{repo}/git/trees"]["response"]
type createCommitResponse = Endpoints[`POST /repos/{owner}/{repo}/git/commits`]["response"]
export type CreateCommitV3Response = OctokitResponse<createCommitResponse["data"]>
type updateReferenceResponse = Endpoints[`PATCH /repos/{owner}/{repo}/git/refs/{ref}`]["response"]
export type UpdateReferenceV3Response = OctokitResponse<updateReferenceResponse["data"]>
type createBranchRefResponse = Endpoints[`POST /repos/{owner}/{repo}/git/refs`]["response"]
export type CreateBranchRefV3Response = OctokitResponse<createBranchRefResponse["data"]>


export type JSONType = null
    | string
    | boolean
    | number
    | JSONType[]
    | Record<string, unknown>

export type Metrics = {
    dates: string[];
    count: number[];
    uniques: number[];
}

export type DataBlobType = {
    path: string;
    mode: string;
    type: string;
    content: string;
}