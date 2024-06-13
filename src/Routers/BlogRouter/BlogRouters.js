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
exports.BlogRouter = void 0;
var express_1 = require("express");
var InputValidations_1 = require("../../Applications/Middleware/input-validation/InputValidations");
var AdminAuth_1 = require("../../Applications/Middleware/auth/AdminAuth");
var settings_1 = require("../../settings");
var save_error_1 = require("../../Utils/error-utils/save-error");
var default_values_1 = require("../../Utils/default-values/default-values");
var BlogQueryRepositories_1 = require("../../Repositories/BlogRepositories/BlogQueryRepositories");
var BlogService_1 = require("../../Service/BlogService/BlogService");
var PostService_1 = require("../../Service/PostService/PostService");
var PostQueryRepositories_1 = require("../../Repositories/PostRepositories/PostQueryRepositories");
exports.BlogRouter = (0, express_1.Router)();
exports.BlogRouter.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queryValue, result, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, default_values_1.defaultBlogValues.defaultQueryValue(req.query)];
            case 1:
                queryValue = _a.sent();
                return [4 /*yield*/, BlogQueryRepositories_1.BlogQueryRepositories.GetAllBlogs(queryValue)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json(result)];
            case 3:
                e_1 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs, "/"), 'GET', 'Get the all blog items', e_1);
                return [2 /*return*/, res.sendStatus(500)];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.BlogRouter.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, BlogQueryRepositories_1.BlogQueryRepositories.GetBlogById(req.params.id)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result ? res.status(200).json(result) : res.status(404).json(null)];
            case 2:
                e_2 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs, "/:id"), 'GET', 'Get the blog item by ID', e_2);
                return [2 /*return*/, res.sendStatus(500)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.BlogRouter.get("/:id".concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs_posts), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queryValue, result, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, default_values_1.defaultValueBasic.defaultPaginationAndSortValues(req.query)];
            case 1:
                queryValue = _a.sent();
                return [4 /*yield*/, PostQueryRepositories_1.PostQueryRepositories.GetAllBlogs(queryValue)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json(result)];
            case 3:
                e_3 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs, "/:id").concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs_posts), 'GET', 'Get all the post items by blog ID', e_3);
                return [2 /*return*/, res.sendStatus(500)];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.BlogRouter.post('/', AdminAuth_1.authValidation, InputValidations_1.RuleValidations.validDescription, InputValidations_1.RuleValidations.validName, InputValidations_1.RuleValidations.validWebsiteUrl, InputValidations_1.inputValidation, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, BlogService_1.BlogService.CreateBlogItem(req.body)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.status(201).json(result)];
            case 2:
                e_4 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs, "/"), 'POST', 'Create a blog item', e_4);
                return [2 /*return*/, res.sendStatus(500)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.BlogRouter.post("/:id".concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs_posts), AdminAuth_1.authValidation, InputValidations_1.RuleValidations.validTitle, InputValidations_1.RuleValidations.validShortDescription, InputValidations_1.RuleValidations.validContent, InputValidations_1.inputValidation, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                req.body.blogId = req.params.id;
                return [4 /*yield*/, PostService_1.PostService.CreatePostItemByBlogId(req.body)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result ? res.status(201).json(result) : res.status(404).json(null)];
            case 2:
                e_5 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs, "/:id").concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs_posts), 'POST', 'Create a post element by blog ID', e_5);
                return [2 /*return*/, res.sendStatus(500)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.BlogRouter.put('/:id', AdminAuth_1.authValidation, InputValidations_1.RuleValidations.validDescription, InputValidations_1.RuleValidations.validName, InputValidations_1.RuleValidations.validWebsiteUrl, InputValidations_1.inputValidation, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, BlogService_1.BlogService.UpdateBlogById(req.params.id, req.body)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.sendStatus(result)];
            case 2:
                e_6 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs, "/:id"), 'PUT', 'Update the blog item by ID', e_6);
                return [2 /*return*/, res.sendStatus(500)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.BlogRouter.delete('/:id', AdminAuth_1.authValidation, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, BlogService_1.BlogService.DeleteBlogById(req.params.id)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.sendStatus(result)];
            case 2:
                e_7 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.BLOG.blogs, "/:id"), 'DELETE', 'Delete the blog item by ID', e_7);
                return [2 /*return*/, res.sendStatus(500)];
            case 3: return [2 /*return*/];
        }
    });
}); });
