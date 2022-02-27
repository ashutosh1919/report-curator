import * as apiOps from './api';
import * as trafficOps from './traffic';
import { template, dataSchema, dataFileName } from './constants';
import { 
    TreeType,
    JSONType, 
    ListBranchesResponse,
    ViewersResponse,
    ClonersResponse,
    Metrics,
    UpdateReferenceV3Response
} from '../types';
import { WebhookPayload, PayloadRepository } from '@actions/github/lib/interfaces';
import { Octokit } from 'octokit';

export function cloneJSON(jsonObj: JSONType): ListBranchesResponse["data"] | JSONType {
    return JSON.parse(JSON.stringify(jsonObj));
}

export function getCurrentBranchName(payload: WebhookPayload): string {
    return (payload["repository"] as PayloadRepository)["default_branch"];
}

export function getRepositoryOwner(payload: WebhookPayload): string {
    return (payload["repository"] as PayloadRepository)["owner"]["name"] as string;
}

export function getRepositoryName(payload: WebhookPayload): string {
    return (payload["repository"] as PayloadRepository)["name"];
}

export function getBranchConfig(branchConfig: ListBranchesResponse["data"], branch: string)
    : ListBranchesResponse["data"][0] | Record<string, never> {
    for (let i = 0; i < branchConfig.length; i++) {
        if (branchConfig[i]["name"] === branch) {
            return (cloneJSON(branchConfig[i]) as ListBranchesResponse["data"][0]);
        }
    }
    return {};
}

async function createBlobFromFileUrl(
    fileUrl: string,
    filePath: string,
    mode: TreeType["mode"] = '100644',
    type: TreeType["type"] = 'blob'): Promise<TreeType> {
    const content: string = await apiOps.getTextFromFileUrl(fileUrl);
    return {
        path: filePath,
        mode: mode,
        type: type,
        content: content
    }
}

function convertTimeStampDataToPlotData(data: ViewersResponse["data"]["views"] | ClonersResponse["data"]["clones"]): Metrics {
    const x: string[] = [];
    const yCount: number[] = [];
    const yUniques: number[] = [];
    for(let i = 0; i < data.length; i++){
        const date: string[] = data[i]["timestamp"].split('T')[0].split('-');
        const ts: string = date[1]+'/'+date[2];
        const count: number = +data[i]["count"];
        const uniques: number = +data[i]["uniques"];
        x.push(ts);
        yCount.push(count);
        yUniques.push(uniques);
    }
    return {
        dates: x,
        count: yCount,
        uniques: yUniques
    };
}

async function generateDataBlobFromSchema(
    octokit: Octokit,
    owner: string,
    repository: string,
    mode: TreeType["mode"] = '100644',
    type: TreeType["type"] = 'blob'): Promise<TreeType> {
    const viewsData = await trafficOps.getViewers(
        octokit,
        owner,
        repository
    );
    const clonesData = await trafficOps.getCloners(
        octokit,
        owner,
        repository
    );
    const data: { views: Metrics, clones: Metrics } = JSON.parse(JSON.stringify(dataSchema));
    data["views"] = convertTimeStampDataToPlotData(viewsData["data"]["views"]);
    data["clones"] = convertTimeStampDataToPlotData(clonesData["data"]["clones"]);
    const content = `let data = ${JSON.stringify(data)};`
    return {
        path: dataFileName,
        mode: mode,
        type: type,
        content: content
    }
}

async function createFileTreeFromTemplate(
        octokit: Octokit,
        owner: string,
        repository: string): Promise<TreeType[]> {
    const tree: TreeType[] = [];

    for(let i = 0; i < template.html.length; i++){
        const blob = await createBlobFromFileUrl(template.html[i].url, template.html[i].name);
        tree.push(blob);
    }

    for(let i = 0; i < template.css.length; i++){
        const blob = await createBlobFromFileUrl(template.css[i].url, template.css[i].name);
        tree.push(blob);
    }
    for(let i = 0; i < template.js.length; i++){
        const blob = await createBlobFromFileUrl(template.js[i].url, template.js[i].name);
        tree.push(blob);
    }
    tree.push(
        await generateDataBlobFromSchema(
            octokit,
            owner,
            repository
        )
    );
    return tree
}

export async function pushTemplateBlobContent(
        octokit: Octokit,
        owner: string,
        repository: string,
        reportBranch: string,
        reportBranchConfig: ListBranchesResponse["data"][0]): Promise<UpdateReferenceV3Response> {
    // let content: string = await apiOps.getTemplateFileText(); // getReportTemplateContent();
    // console.log(content);
    console.log(owner, repository);
    const contentTree = await createFileTreeFromTemplate(
        octokit,
        owner,
        repository
    );
    const fileTree = await apiOps.createFileTreeV3(
        octokit,
        owner,
        repository,
        contentTree
    );
    const commitFile = await apiOps.createCommitV3(
        octokit,
        owner,
        repository,
        'Updated Report using report-curator',
        fileTree.data.sha,
        [reportBranchConfig.commit.sha]
    );
    return await apiOps.updateReferenceV3(
        octokit,
        owner,
        repository,
        reportBranch,
        commitFile.data.sha,
        true
    );
}

// import { Octokit } from 'octokit';
// let octokit = new Octokit({ auth: '' });
// pushTemplateBlobContent(octokit, 'ashutosh1919', 'report-curator', 'report', {
//     name: 'report',
//     commit: {
//       sha: '0f85fc4aaf05d1857e2c02909573847912a56d2a',
//       url: 'https://api.github.com/repos/ashutosh1919/report-curator/commits/0f85fc4aaf05d1857e2c02909573847912a56d2a'
//     },
//     protected: false,
//     protection: {
//       enabled: false,
//       required_status_checks: { enforcement_level: 'off', contexts: [], checks: [] }
//     },
//     protection_url: 'https://api.github.com/repos/ashutosh1919/report-curator/branches/report/protection'
//   }).then(res => console.log(JSON.stringify(res)));

// console.log(convertTimeStampDataToPlotData(
//     [{"timestamp":"2021-11-19T00:00:00Z","count":12,"uniques":5},{"timestamp":"2021-11-20T00:00:00Z","count":1,"uniques":1},{"timestamp":"2021-11-21T00:00:00Z","count":9,"uniques":7},{"timestamp":"2021-11-22T00:00:00Z","count":12,"uniques":12},{"timestamp":"2021-11-23T00:00:00Z","count":15,"uniques":11},{"timestamp":"2021-11-24T00:00:00Z","count":11,"uniques":8},{"timestamp":"2021-11-25T00:00:00Z","count":9,"uniques":8},{"timestamp":"2021-11-26T00:00:00Z","count":11,"uniques":9},{"timestamp":"2021-11-27T00:00:00Z","count":24,"uniques":11},{"timestamp":"2021-11-28T00:00:00Z","count":7,"uniques":6},{"timestamp":"2021-11-29T00:00:00Z","count":24,"uniques":15},{"timestamp":"2021-11-30T00:00:00Z","count":13,"uniques":13},{"timestamp":"2021-12-01T00:00:00Z","count":7,"uniques":7},{"timestamp":"2021-12-02T00:00:00Z","count":9,"uniques":7}]    
// ))
// createFileTreeFromTemplate().then(res => console.log(res));
// apiOps.getTemplateFileText().then(res=> console.log(JSON.stringify(res)));