import * as core from '@actions/core';

export function logInput(content: any): any {
    core.info(content);
}