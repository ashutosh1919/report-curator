
export function getCurrentBranchName(payload: any): string {
    return payload["repository"]["default_branch"];
}

export function getRepositoryOwner(payload: any): string {
    return payload["repository"]["owner"]["name"];
}

export function getRepositoryName(payload: any): string {
    return payload["repository"]["name"];
}