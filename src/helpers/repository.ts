import * as fs from 'fs';
import * as path from 'path';
import * as apiOps from './api';
import { template } from './constants';

export function cloneJSON(jsonObj: any): any {
    return JSON.parse(JSON.stringify(jsonObj));
}

export function getCurrentBranchName(payload: any): string {
    return payload["repository"]["default_branch"];
}

export function getRepositoryOwner(payload: any): string {
    return payload["repository"]["owner"]["name"];
}

export function getRepositoryName(payload: any): string {
    return payload["repository"]["name"];
}

export function getBranchConfig(branchConfig: any, branch: string): any {
    for(let i = 0; i < branchConfig.length; i++) {
        if(branchConfig[i]["name"] === branch) {
            return cloneJSON(branchConfig[i]);
        }
    }
    return {};
}

async function createBlobFromFileUrl(
        fileUrl: string,
        filePath: string,
        mode: string = '100644',
        type: string = 'blob'): Promise<any> {
    let content: string = await apiOps.getTextFromFileUrl(fileUrl);
    return {
        path: filePath,
        mode: mode,
        type: type,
        content: content
    }
}

async function createFileTreeFromTemplate(): Promise<any> {
    let tree: any = [];

    for(let i = 0; i < template.html.length; i++){
        let blob = await createBlobFromFileUrl(template.html[i].url, template.html[i].name);
        tree.push(blob);
    }

    for(let i = 0; i < template.css.length; i++){
        let blob = await createBlobFromFileUrl(template.css[i].url, template.css[i].name);
        tree.push(blob);
    }
    return tree
}

export async function pushTemplateBlobContent(
        octokit: any,
        owner: string,
        repository: string,
        reportBranch: string,
        reportBranchConfig: any): Promise<any> {
    // let content: string = await apiOps.getTemplateFileText(); // getReportTemplateContent();
    // console.log(content);
    let contentTree = await createFileTreeFromTemplate();
    let fileTree: any = await apiOps.createFileTreeV3(
        octokit,
        owner,
        repository,
        contentTree,
        reportBranchConfig.commit.sha
    );
    let commitFile = await apiOps.createCommitV3(
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

// createFileTreeFromTemplate().then(res => console.log(res));
// apiOps.getTemplateFileText().then(res=> console.log(JSON.stringify(res)));