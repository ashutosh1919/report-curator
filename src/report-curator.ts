import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import * as fs from 'fs';

import { getActionSecrets } from './helpers/secrets';
import * as repOps from './helpers/repository';
import * as apiOps from './helpers/api';
// import { getViewers, getCloners } from './helpers/traffic';

function getReportTemplateContent(): string {
  return fs.readFileSync('templates/index.html', 'utf8').toString();
}

async function curate(){
    try {
        // `who-to-greet` input defined in action metadata file
        const nameToGreet: string = core.getInput('who-to-greet');
        console.log(`Hello ${nameToGreet}!`);
        const authToken: string = core.getInput('auth_token');
        const reportBranch: string = core.getInput('report_branch');

        // Get the JSON webhook payload for the event that triggered the workflow
        const payload: string = JSON.stringify(github.context.payload, undefined, 2)
        const payloadObj: any = JSON.parse(payload);
        // console.log(`The event payload: ${payload}`);

        const repository: string = payloadObj['repository']['name'];
        const owner: string = payloadObj['repository']['owner']['name'];

        // console.log(repository);
        // console.log(owner);

        let config: any = await getActionSecrets(authToken, payloadObj);
        let defaultBranchConfig: any = await repOps.getBranchConfig(
            config.branches,
            config.branch);
        let reportBranchConfig: any = await repOps.getBranchConfig(
            config.branches,
            reportBranch);
        if(Object.keys(reportBranchConfig).length === 0){
              let res: any = await apiOps.createBranchRefV3(
                  config.octokit,
                  owner,
                  repository,
                  reportBranch,
                  defaultBranchConfig["commit"]["sha"]);
              config = await getActionSecrets(authToken, payloadObj);
              reportBranchConfig = await repOps.getBranchConfig(
                  config.branches,
                  reportBranch);
        }

        let templateContent: string = getReportTemplateContent()
        // let templateContent: string = repOps.pushTemplateBlobContent(
        //     config.octokit,
        //     owner,
        //     repository
        // );
        let blobResponse: any = await apiOps.createFileBlobV3(
            config.octokit,
            owner,
            repository,
            templateContent
        );

        console.log(blobResponse);

        // console.log(JSON.stringify(config.branches));
        
        // getViewers(authToken, owner, repository)
        //   .then(res => JSON.stringify(res))
        //   .then(res => console.log(res))
        //   .catch(error => core.setFailed(JSON.stringify(error)));
        
        // getCloners(authToken, owner, repository)
        //   .then(res => JSON.stringify(res))
        //   .then(res => console.log(res))
        //   .catch(error => core.setFailed(JSON.stringify(error)));

        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
      } catch (error: any) {
        core.setFailed(error.message);
      }
      
}

// getViewers().then(res => console.log(JSON.stringify(res)));

curate();