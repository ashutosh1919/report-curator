
export function getCurrentBranchName(payload: object): string {
    return payload["repository"]["default_branch"];
}

export function getRepositoryOwner(payload: object): string {
    return payload["repsitory"]["owner"]["name"];
}

export function getRepositoryName(payload: object): string {
    return payload["repository"]["name"];
}