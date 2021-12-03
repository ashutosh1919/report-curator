import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import { getActionSecrets } from './helpers/secrets';
// import { getViewers, getCloners } from './helpers/traffic';

async function curate(){
    try {
        // `who-to-greet` input defined in action metadata file
        const nameToGreet: string = core.getInput('who-to-greet');
        console.log(`Hello ${nameToGreet}!`);
        const authToken: string = core.getInput('auth_token');

        // Get the JSON webhook payload for the event that triggered the workflow
        const payload: string = JSON.stringify(github.context.payload, undefined, 2)
        const payloadObj: any = JSON.parse(payload);
        console.log(`The event payload: ${payload}`);

        const repository: string = payloadObj['repository']['name'];
        const owner: string = payloadObj['repository']['owner']['name'];

        console.log(repository);
        console.log(owner);

        let config: any = await getActionSecrets(authToken, payloadObj);

        console.log(JSON.stringify(config));
        
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