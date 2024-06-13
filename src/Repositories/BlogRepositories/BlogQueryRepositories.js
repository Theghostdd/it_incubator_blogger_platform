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
exports.BlogQueryRepositories = void 0;
var mongodb_1 = require("mongodb");
var Connection_1 = require("../../Applications/ConnectionDB/Connection");
var BlogService_1 = require("../../Service/BlogService/BlogService");
var map_1 = require("../../Utils/map/map");
var settings_1 = require("../../settings");
exports.BlogQueryRepositories = {
    GetAllBlogs: function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var sort, filter, pagination, result, e_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        sort = (_a = {},
                            _a[query.sortBy] = query.sortDirection,
                            _a);
                        filter = {
                            name: { $regex: query.searchNameTerm, $options: 'i' }
                        };
                        return [4 /*yield*/, BlogService_1.BlogService.CreatePagination(query.pageNumber, query.pageSize, filter)];
                    case 1:
                        pagination = _b.sent();
                        return [4 /*yield*/, Connection_1.db.collection(settings_1.MONGO_SETTINGS.COLLECTIONS.blogs)
                                .find(filter)
                                .sort(sort)
                                .skip(pagination.skip)
                                .limit(pagination.pageSize)
                                .toArray()];
                    case 2:
                        result = _b.sent();
                        return [4 /*yield*/, map_1.map.mapBlogs(result, pagination)];
                    case 3: return [2 /*return*/, _b.sent()];
                    case 4:
                        e_1 = _b.sent();
                        throw new Error(e_1);
                    case 5: return [2 /*return*/];
                }
            });
        });
    },
    GetBlogById: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var result, _a, e_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, Connection_1.db.collection(settings_1.MONGO_SETTINGS.COLLECTIONS.blogs).findOne({ _id: new mongodb_1.ObjectId(id) })];
                    case 1:
                        result = _b.sent();
                        if (!result) return [3 /*break*/, 3];
                        return [4 /*yield*/, map_1.map.mapBlog(result, null)];
                    case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = null;
                        _b.label = 4;
                    case 4: return [2 /*return*/, _a];
                    case 5:
                        e_2 = _b.sent();
                        throw new Error(e_2);
                    case 6: return [2 /*return*/];
                }
            });
        });
    },
    GetCountElements: function (filter) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, Connection_1.db.collection(settings_1.MONGO_SETTINGS.COLLECTIONS.blogs).countDocuments(filter)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_3 = _a.sent();
                        throw new Error(e_3);
                    case 3: return [2 /*return*/];
                }
            });
        });
    }
};