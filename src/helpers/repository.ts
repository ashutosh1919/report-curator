import * as fs from 'fs';
import * as path from 'path';
import * as apiOps from './api';
import * as trafficOps from './traffic';
import { template, dataSchema, dataFileName, defaultTheme } from './constants';
import { default as themes } from './data/themes.json';

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

function convertTimeStampDataToPlotData(data: any): any {
    let x: any = [];
    let yCount: any = [];
    let yUniques: any = [];
    for(let i = 0; i < data.length; i++){
        let date: any = data[i]["timestamp"].split('T')[0].split('-');
        let ts: string = date[1]+'/'+date[2];
        let count: number = +data[i]["count"];
        let uniques: number = +data[i]["uniques"];
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
        octokit: any,
        owner: string,
        repository: string,
        reportTheme: string,
        mode: string = '100644',
        type: string = 'blob'): Promise<any> {
    let viewsData = await trafficOps.getViewers(
        octokit,
        owner,
        repository
    );
    let clonesData = await trafficOps.getCloners(
        octokit,
        owner,
        repository
    );
    let data: any = JSON.parse(JSON.stringify(dataSchema));
    if(!(reportTheme in themes)) {
        reportTheme = defaultTheme;
    }
    data["theme"] = themes[reportTheme];
    data["views"] = convertTimeStampDataToPlotData(viewsData["data"]["views"]);
    data["clones"] = convertTimeStampDataToPlotData(clonesData["data"]["clones"]);
    let content: any = `let data = ${JSON.stringify(data)};`
    console.log(data, reportTheme);
    return {
        path: dataFileName,
        mode: mode,
        type: type,
        content: content
    }
}

async function createFileTreeFromTemplate(
        octokit: any,
        owner: string,
        repository: string,
        reportTheme: string): Promise<any> {
    let tree: any = [];

    for(let i = 0; i < template.html.length; i++){
        let blob = await createBlobFromFileUrl(template.html[i].url, template.html[i].name);
        tree.push(blob);
    }

    for(let i = 0; i < template.css.length; i++){
        let blob = await createBlobFromFileUrl(template.css[i].url, template.css[i].name);
        tree.push(blob);
    }
    for(let i = 0; i < template.js.length; i++){
        let blob = await createBlobFromFileUrl(template.js[i].url, template.js[i].name);
        tree.push(blob);
    }
    tree.push(
        await generateDataBlobFromSchema(
            octokit,
            owner,
            repository,
            reportTheme
        )
    );
    return tree
}

export async function pushTemplateBlobContent(
        octokit: any,
        owner: string,
        repository: string,
        reportBranch: string,
        reportTheme: string,
        reportBranchConfig: any): Promise<any> {
    // let content: string = await apiOps.getTemplateFileText(); // getReportTemplateContent();
    // console.log(content);
    // test comment 1
    console.log(owner, repository);
    let contentTree = await createFileTreeFromTemplate(
        octokit,
        owner,
        repository,
        reportTheme
    );
    console.log("Creating tree from template succeeded.");
    let fileTree: any = await apiOps.createFileTreeV3(
        octokit,
        owner,
        repository,
        contentTree
    );
    console.log("Storing file tree succeeded.");
    let commitFile = await apiOps.createCommitV3(
        octokit,
        owner,
        repository,
        'Updated Report using report-curator',
        fileTree.data.sha,
        [reportBranchConfig.commit.sha]
    );
    console.log("Creating commit succeeded.");
    return await apiOps.updateReferenceV3(
        octokit,
        owner,
        repository,
        reportBranch,
        commitFile.data.sha,
        true
    );
}

// console.log(themes);

// import { Octokit } from 'octokit';
// let octokit = new Octokit({ auth: '' });
// pushTemplateBlobContent(octokit, 'ashutosh1919', 'report-curator', 'report', 'rose', {
//     name: 'report',
//     commit: {
//       sha: '5dffe72bee501842366c662aab06896266e8e465',
//       url: 'https://api.github.com/repos/ashutosh1919/report-curator/commits/5dffe72bee501842366c662aab06896266e8e465'
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