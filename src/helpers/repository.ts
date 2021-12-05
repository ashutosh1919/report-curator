import * as fs from 'fs';
import * as path from 'path';

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

export function pushTemplateBlobContent(
        octokit: any,
        owner: string,
        repository: string): string {
    return getReportTemplateContent();
}

// console.log(getReportTemplateContent())