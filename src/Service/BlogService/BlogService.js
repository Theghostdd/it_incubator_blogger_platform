"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
var BlogQueryRepositories_1 = require("../../Repositories/BlogRepositories/BlogQueryRepositories");
var BlogRepositories_1 = require("../../Repositories/BlogRepositories/BlogRepositories");
var default_values_1 = require("../../Utils/default-values/default-values");
var map_1 = require("../../Utils/map/map");
exports.BlogService = {
    CreateBlogItem: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var CreateData, _a, result, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        _a = [__assign({}, data)];
                        return [4 /*yield*/, default_values_1.defaultBlogValues.defaultCreateValues()];
                    case 1:
                        CreateData = __assign.apply(void 0, _a.concat([_b.sent()]));
                        return [4 /*yield*/, BlogRepositories_1.BlogRepositories.CreateBlog(CreateData)];
                    case 2:
                        result = _b.sent();
                        return [4 /*yield*/, map_1.map.mapBlog(CreateData, result)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        e_1 = _b.sent();
                        throw new Error(e_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    UpdateBlogById: function (id, data) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, BlogRepositories_1.BlogRepositories.UpdateBlogById(id, data)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.matchedCount > 0 ? 204 : 404];
                    case 2:
                        e_2 = _a.sent();
                        throw new Error(e_2);
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    DeleteBlogById: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, BlogRepositories_1.BlogRepositories.DeleteBlogById(id)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result.deletedCount > 0 ? 204 : 404];
                    case 2:
                        e_3 = _a.sent();
                        throw new Error(e_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    CreatePagination: function (page, pageSize, filter) {
        return __awaiter(this, void 0, void 0, function () {
            var getTotalCount, totalCount, pagesCount, skip, e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, BlogQueryRepositories_1.BlogQueryRepositories.GetCountElements(filter)];
                    case 1:
                        getTotalCount = _a.sent();
                        totalCount = +getTotalCount;
                        pagesCount = Math.ceil(totalCount / pageSize);
                        skip = (page - 1) * pageSize;
                        return [2 /*return*/, {
                                totalCount: +totalCount,
                                pagesCount: +pagesCount,
                                skip: +skip,
                                pageSize: +pageSize,
                                page: +page
                            }];
                    case 2:
                        e_4 = _a.sent();
                        throw new Error();
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};
