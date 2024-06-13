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
exports.UserRouter = void 0;
var express_1 = require("express");
var AdminAuth_1 = require("../../Applications/Middleware/auth/AdminAuth");
var InputValidations_1 = require("../../Applications/Middleware/input-validation/InputValidations");
var save_error_1 = require("../../Utils/error-utils/save-error");
var settings_1 = require("../../settings");
var UserService_1 = require("../../Service/UserService/UserService");
var default_values_1 = require("../../Utils/default-values/default-values");
var UserQueryRepositories_1 = require("../../Repositories/UserRepostitories/UserQueryRepositories");
exports.UserRouter = (0, express_1.Router)();
exports.UserRouter.get('/', AdminAuth_1.authValidation, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var queryValue, result, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, default_values_1.defaultUserValues.defaultQueryValue(req.query)];
            case 1:
                queryValue = _a.sent();
                return [4 /*yield*/, UserQueryRepositories_1.UserQueryRepositories.GetAllUsers(queryValue)];
            case 2:
                result = _a.sent();
                return [2 /*return*/, res.status(200).json(result)];
            case 3:
                e_1 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.USER.user, "/"), 'GET', 'Get a user items', e_1);
                return [2 /*return*/, res.sendStatus(500)];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.UserRouter.post('/', AdminAuth_1.authValidation, InputValidations_1.RuleValidations.validLogin, InputValidations_1.RuleValidations.validPassword, InputValidations_1.RuleValidations.validEmail, InputValidations_1.inputValidation, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, UserService_1.UserService.CreateUserItem(req.body)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, ('errorsMessages' in result) ? res.status(400).json(result) : res.status(201).json(result)];
            case 2:
                e_2 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.USER.user, "/"), 'POST', 'Create the user item', e_2);
                return [2 /*return*/, res.sendStatus(500)];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.UserRouter.delete('/:id', AdminAuth_1.authValidation, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, UserService_1.UserService.DeleteUserById(req.params.id)];
            case 1:
                result = _a.sent();
                return [2 /*return*/, res.sendStatus(result)];
            case 2:
                e_3 = _a.sent();
                (0, save_error_1.SaveError)("".concat(settings_1.ROUTERS_SETTINGS.USER.user, "/:id"), 'DELETE', 'Delete the user item by ID', e_3);
                return [2 /*return*/, res.sendStatus(500)];
            case 3: return [2 /*return*/];
        }
    });
}); });
