import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as github from '@actions/github';

import { getViewers, getCloners } from './helpers/traffic';

async function curate(){
    try {
        // `who-to-greet` input defined in action metadata file
        const nameToGreet: string = core.getInput('who-to-greet');
        console.log(`Hello ${nameToGreet}!`);
        const authToken: string = core.getInput('auth_token');
        
        getViewers(authToken)
          .then(res => JSON.stringify(res))
          .then(res => console.log(res))
          .catch(error => core.setFailed(JSON.stringify(error)))

        const time = (new Date()).toTimeString();
        core.setOutput("time", time);
        // Get the JSON webhook payload for the event that triggered the workflow
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
      } catch (error: any) {
        core.setFailed(error.message);
      }
      
}

// getViewers().then(res => console.log(JSON.stringify(res)));

// curate();