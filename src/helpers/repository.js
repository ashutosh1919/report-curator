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
exports.pushTemplateBlobContent = exports.getBranchConfig = exports.getRepositoryName = exports.getRepositoryOwner = exports.getCurrentBranchName = exports.cloneJSON = void 0;
var apiOps = require("./api");
var trafficOps = require("./traffic");
var constants_1 = require("./constants");
function cloneJSON(jsonObj) {
    return JSON.parse(JSON.stringify(jsonObj));
}
exports.cloneJSON = cloneJSON;
function getCurrentBranchName(payload) {
    return payload["repository"]["default_branch"];
}
exports.getCurrentBranchName = getCurrentBranchName;
function getRepositoryOwner(payload) {
    return payload["repository"]["owner"]["name"];
}
exports.getRepositoryOwner = getRepositoryOwner;
function getRepositoryName(payload) {
    return payload["repository"]["name"];
}
exports.getRepositoryName = getRepositoryName;
function getBranchConfig(branchConfig, branch) {
    for (var i = 0; i < branchConfig.length; i++) {
        if (branchConfig[i]["name"] === branch) {
            return cloneJSON(branchConfig[i]);
        }
    }
    return {};
}
exports.getBranchConfig = getBranchConfig;
function createBlobFromFileUrl(fileUrl, filePath, mode, type) {
    if (mode === void 0) { mode = '100644'; }
    if (type === void 0) { type = 'blob'; }
    return __awaiter(this, void 0, void 0, function () {
        var content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, apiOps.getTextFromFileUrl(fileUrl)];
                case 1:
                    content = _a.sent();
                    return [2 /*return*/, {
                            path: filePath,
                            mode: mode,
                            type: type,
                            content: content
                        }];
            }
        });
    });
}
function convertTimeStampDataToPlotData(data) {
    var x = [];
    var yCount = [];
    var yUniques = [];
    for (var i = 0; i < data.length; i++) {
        var date = data[i]["timestamp"].split('T')[0].split('-');
        var ts = date[1] + '/' + date[2];
        var count = +data[i]["count"];
        var uniques = +data[i]["uniques"];
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
function generateDataBlobFromSchema(octokit, owner, repository, reportTheme, mode, type) {
    if (mode === void 0) { mode = '100644'; }
    if (type === void 0) { type = 'blob'; }
    return __awaiter(this, void 0, void 0, function () {
        var viewsData, clonesData, data, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, trafficOps.getViewers(octokit, owner, repository)];
                case 1:
                    viewsData = _a.sent();
                    return [4 /*yield*/, trafficOps.getCloners(octokit, owner, repository)];
                case 2:
                    clonesData = _a.sent();
                    data = JSON.parse(JSON.stringify(constants_1.dataSchema));
                    if (!(reportTheme in constants_1.themes)) {
                        reportTheme = constants_1.defaultTheme;
                    }
                    data["theme"] = constants_1.themes[reportTheme];
                    data["views"] = convertTimeStampDataToPlotData(viewsData["data"]["views"]);
                    data["clones"] = convertTimeStampDataToPlotData(clonesData["data"]["clones"]);
                    content = "let data = " + JSON.stringify(data) + ";";
                    return [2 /*return*/, {
                            path: constants_1.dataFileName,
                            mode: mode,
                            type: type,
                            content: content
                        }];
            }
        });
    });
}
function createFileTreeFromTemplate(octokit, owner, repository, reportTheme) {
    return __awaiter(this, void 0, void 0, function () {
        var tree, i, blob, i, blob, i, blob, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tree = [];
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < constants_1.template.html.length)) return [3 /*break*/, 4];
                    return [4 /*yield*/, createBlobFromFileUrl(constants_1.template.html[i].url, constants_1.template.html[i].name)];
                case 2:
                    blob = _c.sent();
                    tree.push(blob);
                    _c.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    i = 0;
                    _c.label = 5;
                case 5:
                    if (!(i < constants_1.template.css.length)) return [3 /*break*/, 8];
                    return [4 /*yield*/, createBlobFromFileUrl(constants_1.template.css[i].url, constants_1.template.css[i].name)];
                case 6:
                    blob = _c.sent();
                    tree.push(blob);
                    _c.label = 7;
                case 7:
                    i++;
                    return [3 /*break*/, 5];
                case 8:
                    i = 0;
                    _c.label = 9;
                case 9:
                    if (!(i < constants_1.template.js.length)) return [3 /*break*/, 12];
                    return [4 /*yield*/, createBlobFromFileUrl(constants_1.template.js[i].url, constants_1.template.js[i].name)];
                case 10:
                    blob = _c.sent();
                    tree.push(blob);
                    _c.label = 11;
                case 11:
                    i++;
                    return [3 /*break*/, 9];
                case 12:
                    _b = (_a = tree).push;
                    return [4 /*yield*/, generateDataBlobFromSchema(octokit, owner, repository, reportTheme)];
                case 13:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, tree];
            }
        });
    });
}
function pushTemplateBlobContent(octokit, owner, repository, reportBranch, reportTheme, reportBranchConfig) {
    return __awaiter(this, void 0, void 0, function () {
        var contentTree, fileTree, commitFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // let content: string = await apiOps.getTemplateFileText(); // getReportTemplateContent();
                    // console.log(content);
                    // test comment
                    console.log(owner, repository);
                    return [4 /*yield*/, createFileTreeFromTemplate(octokit, owner, repository, reportTheme)];
                case 1:
                    contentTree = _a.sent();
                    return [4 /*yield*/, apiOps.createFileTreeV3(octokit, owner, repository, contentTree)];
                case 2:
                    fileTree = _a.sent();
                    return [4 /*yield*/, apiOps.createCommitV3(octokit, owner, repository, 'Updated Report using report-curator', fileTree.data.sha, [reportBranchConfig.commit.sha])];
                case 3:
                    commitFile = _a.sent();
                    return [4 /*yield*/, apiOps.updateReferenceV3(octokit, owner, repository, reportBranch, commitFile.data.sha, true)];
                case 4: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.pushTemplateBlobContent = pushTemplateBlobContent;
var octokit_1 = require("octokit");
var octokit = new octokit_1.Octokit({ auth: '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' });
pushTemplateBlobContent(octokit, 'ashutosh1919', 'report-curator', 'report', 'rose', {
    name: 'report',
    commit: {
        sha: '0f85fc4aaf05d1857e2c02909573847912a56d2a',
        url: 'https://api.github.com/repos/ashutosh1919/report-curator/commits/0f85fc4aaf05d1857e2c02909573847912a56d2a'
    },
    protected: false,
    protection: {
        enabled: false,
        required_status_checks: { enforcement_level: 'off', contexts: [], checks: [] }
    },
    protection_url: 'https://api.github.com/repos/ashutosh1919/report-curator/branches/report/protection'
}).then(function (res) { return console.log(JSON.stringify(res)); });
// console.log(convertTimeStampDataToPlotData(
//     [{"timestamp":"2021-11-19T00:00:00Z","count":12,"uniques":5},{"timestamp":"2021-11-20T00:00:00Z","count":1,"uniques":1},{"timestamp":"2021-11-21T00:00:00Z","count":9,"uniques":7},{"timestamp":"2021-11-22T00:00:00Z","count":12,"uniques":12},{"timestamp":"2021-11-23T00:00:00Z","count":15,"uniques":11},{"timestamp":"2021-11-24T00:00:00Z","count":11,"uniques":8},{"timestamp":"2021-11-25T00:00:00Z","count":9,"uniques":8},{"timestamp":"2021-11-26T00:00:00Z","count":11,"uniques":9},{"timestamp":"2021-11-27T00:00:00Z","count":24,"uniques":11},{"timestamp":"2021-11-28T00:00:00Z","count":7,"uniques":6},{"timestamp":"2021-11-29T00:00:00Z","count":24,"uniques":15},{"timestamp":"2021-11-30T00:00:00Z","count":13,"uniques":13},{"timestamp":"2021-12-01T00:00:00Z","count":7,"uniques":7},{"timestamp":"2021-12-02T00:00:00Z","count":9,"uniques":7}]    
// ))
// createFileTreeFromTemplate().then(res => console.log(res));
// apiOps.getTemplateFileText().then(res=> console.log(JSON.stringify(res)));
