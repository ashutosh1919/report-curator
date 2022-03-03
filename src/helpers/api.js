"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.updateReferenceV3 = exports.createCommitV3 = exports.createFileTreeV3 = exports.deleteFileFromBranchV3 = exports.getAllFilesFromBranchV3 = exports.putFileContentInBranchV3 = exports.createFileBlobV3 = exports.createBranchRefV3 = exports.getBranchRefV3 = exports.getGitBranchesV3 = exports.getGitResponseV3 = exports.getTextFromFileUrl = exports.getTemplateFileText = void 0;
var node_fetch_1 = require("node-fetch");
var constants_1 = require("./constants");
function getTemplateFileText() {
    return __awaiter(this, void 0, void 0, function () {
        var template;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, node_fetch_1["default"])(constants_1.templateUrl)];
                case 1:
                    template = _a.sent();
                    return [4 /*yield*/, template.text()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getTemplateFileText = getTemplateFileText;
function getTextFromFileUrl(fileUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var fileText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, node_fetch_1["default"])(fileUrl)];
                case 1:
                    fileText = _a.sent();
                    return [4 /*yield*/, fileText.text()];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getTextFromFileUrl = getTextFromFileUrl;
function getGitResponseV3(octokit, url, headers) {
    if (headers === void 0) { headers = constants_1.v3Headers; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request(url, {
                        header: JSON.stringify(headers)
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getGitResponseV3 = getGitResponseV3;
function getGitBranchesV3(octokit, owner, repository) {
    return getGitResponseV3(octokit, "GET /repos/" + owner + "/" + repository + "/branches");
}
exports.getGitBranchesV3 = getGitBranchesV3;
function getBranchRefV3(octokit, owner, repository, branch) {
    return getGitResponseV3(octokit, "GET /repos/" + owner + "/" + repository + "/git/ref/heads/" + branch);
}
exports.getBranchRefV3 = getBranchRefV3;
function createBranchRefV3(octokit, owner, repository, refBranch, baseSHA) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request("POST /repos/" + owner + "/" + repository + "/git/refs", {
                        ref: "refs/heads/" + refBranch,
                        sha: baseSHA
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.createBranchRefV3 = createBranchRefV3;
function createFileBlobV3(octokit, owner, repository, content, encoding) {
    if (encoding === void 0) { encoding = 'utf8'; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request("POST /repos/" + owner + "/" + repository + "/git/blobs", {
                        content: content,
                        encoding: encoding
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.createFileBlobV3 = createFileBlobV3;
function putFileContentInBranchV3(octokit, owner, repository, path, content, commitMessgae, branch) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
                        owner: owner,
                        repo: repository,
                        path: path,
                        content: content,
                        message: commitMessgae,
                        branch: branch
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.putFileContentInBranchV3 = putFileContentInBranchV3;
function getAllFilesFromBranchV3(octokit, owner, repository, ref) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request("GET /repos/{owner}/{repo}/contents", {
                        owner: owner,
                        repo: repository,
                        ref: ref
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getAllFilesFromBranchV3 = getAllFilesFromBranchV3;
function deleteFileFromBranchV3(octokit, owner, repository, path, sha, commitMessgae, branch) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request("DELETE /repos/{owner}/{repo}/contents/{path}", {
                        owner: owner,
                        repo: repository,
                        path: path,
                        sha: sha,
                        message: commitMessgae,
                        branch: branch
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.deleteFileFromBranchV3 = deleteFileFromBranchV3;
function createFileTreeV3(octokit, owner, repository, tree) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request("POST /repos/{owner}/{repo}/git/trees", {
                        owner: owner,
                        repo: repository,
                        tree: tree
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.createFileTreeV3 = createFileTreeV3;
function createCommitV3(octokit, owner, repository, commitMessage, treeSHA, parents) {
    if (parents === void 0) { parents = []; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request("POST /repos/{owner}/{repo}/git/commits", {
                        owner: owner,
                        repo: repository,
                        message: commitMessage,
                        tree: treeSHA,
                        parents: parents
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.createCommitV3 = createCommitV3;
function updateReferenceV3(octokit, owner, repository, branch, sha, force) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, octokit.request("PATCH /repos/{owner}/{repo}/git/refs/heads/" + branch, {
                        owner: owner,
                        repo: repository,
                        sha: sha,
                        force: force
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.updateReferenceV3 = updateReferenceV3;
