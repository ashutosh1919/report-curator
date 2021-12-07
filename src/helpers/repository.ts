import * as fs from 'fs';
import * as path from 'path';
import * as apiOps from './api';

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

function getReportTemplateContent(): string {
    return fs.readFileSync(path.join(__dirname, '../templates/index.html'), 'utf8').toString();
}

async function deleteAllFilesFromBranch(
        octokit: any,
        owner: string,
        repository: string,
        filesData: any,
        branch: string): Promise<any> {
    for(let i = 0; i < filesData.length; i++) {
        let file = filesData[i];
        await apiOps.deleteFileFromBranchV3(
            octokit,
            owner,
            repository,
            file.path,
            file.sha,
            `Deleting file ${file.name}`,
            branch
        );
    }
}

export async function pushTemplateBlobContent(
        octokit: any,
        owner: string,
        repository: string,
        reportBranch: string,
        reportBranchConfig: any): Promise<any> {
    let content: string = getReportTemplateContent();
    let fileTree: any = await apiOps.createFileTreeV3(
        octokit,
        owner,
        repository,
        'index.html',
        content
    );
    let commitFile = await apiOps.createCommitV3(
        octokit,
        owner,
        repository,
        'Updated Report using report-curator',
        fileTree.data.sha
    );
    console.log(commitFile);
    return await apiOps.updateReferenceV3(
        octokit,
        owner,
        repository,
        reportBranch,
        reportBranchConfig.commit.sha,
        true
    );
    // let allFiles: any =  await apiOps.getAllFilesFromBranchV3(
    //     octokit,
    //     owner,
    //     repository,
    //     `refs/heads/${reportBranch}`
    // );

    // await deleteAllFilesFromBranch(
    //     octokit,
    //     owner,
    //     repository,
    //     allFiles.data,
    //     reportBranch
    // );
    // let deleteFilesRes: string = await apiOps.deleteAllFilesFromBranchV3(
    //     octokit,
    //     owner,
    //     repository,
    //     'Deleted all files from report branch',
    //     reportBranch
    // );
    // console.log(deleteFilesRes);
    // return await apiOps.putFileContentInBranchV3(
    //     octokit,
    //     owner,
    //     repository,
    //     'index.html',
    //     Buffer.from(content).toString('base64'),
    //     'Updated Report using report-curator',
    //     reportBranch,
    // );
}

// console.log(Buffer.from('Ashutosh Report Curator').toString('base64'));