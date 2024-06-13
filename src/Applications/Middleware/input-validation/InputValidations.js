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
exports.RuleValidations = exports.inputValidation = void 0;
var express_validator_1 = require("express-validator");
var BlogQueryRepositories_1 = require("../../../Repositories/BlogRepositories/BlogQueryRepositories");
var inputValidation = function (req, res, next) {
    var error = (0, express_validator_1.validationResult)(req);
    if (error.array().length > 0) {
        return res.status(400).json({
            errorsMessages: error.array({ onlyFirstError: true }).map(function (e) { return ({
                message: e.msg,
                field: e.path
            }); })
        });
    }
    return next();
};
exports.inputValidation = inputValidation;
exports.RuleValidations = {
    validName: (0, express_validator_1.body)("name")
        .isString()
        .withMessage("The name must be a string")
        .trim()
        .isLength({ min: 1, max: 15 })
        .withMessage("The name can`t be empty and must contain between 1 and 15 characters"),
    validDescription: (0, express_validator_1.body)("description")
        .isString()
        .withMessage("The description must be a string")
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage("The description can`t be empty and must contain between 1 and 500 characters"),
    validWebsiteUrl: (0, express_validator_1.body)("websiteUrl")
        .isString()
        .withMessage("The web site URL must be a string")
        .trim()
        .isLength({ min: 13, max: 100 })
        .withMessage("The web site URL can`t be empty and must contain between 13 and 100 characters")
        .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$")
        .withMessage("The web site URL is invalid"),
    validTitle: (0, express_validator_1.body)("title")
        .isString()
        .withMessage("The title must be a string")
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage("The title can`t be empty and must contain between 1 and 30 characters"),
    validShortDescription: (0, express_validator_1.body)("shortDescription")
        .isString()
        .withMessage("The short description must be a string")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage("The short description  can`t be empty and must contain between 1 and 100 characters"),
    validContent: (0, express_validator_1.body)("content")
        .isString()
        .withMessage("The content must be a string")
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage("The content  can`t be empty and must contain between 1 and 1000 characters"),
    validBlogId: (0, express_validator_1.body)("blogId")
        .isString()
        .withMessage("The blog id must be a string")
        .trim()
        .notEmpty()
        .withMessage("The blog id can`t be empty")
        .custom(function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, BlogQueryRepositories_1.BlogQueryRepositories.GetBlogById(id)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        return [2 /*return*/, true];
                    }
                    throw new Error("Blog id not found");
            }
        });
    }); }),
    validLogin: (0, express_validator_1.body)("login")
        .isLength({ min: 3, max: 10 })
        .matches("^[a-zA-Z0-9_-]*$")
        .withMessage("Login is bad"),
    validPassword: (0, express_validator_1.body)("password")
        .isLength({ min: 6, max: 20 })
        .withMessage('Password is bad'),
    validEmail: (0, express_validator_1.body)("email")
        .notEmpty()
        .matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
        .withMessage('Email is bad'),
    validLoginOrEmail: (0, express_validator_1.body)('loginOrEmail')
        .notEmpty()
        .isLength({ max: 20 })
        .custom(function (value) {
        var isLoginValid = value.length >= 3 && value.length <= 10 && /^[a-zA-Z0-9_-]*$/.test(value);
        var isEmailValid = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        if (!isLoginValid && !isEmailValid) {
            throw new Error();
        }
        return true;
    })
        .withMessage('Bad login or email'),
};
