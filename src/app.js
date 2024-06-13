"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = require("express");
var cors_1 = require("cors");
var settings_1 = require("./settings");
var BlogRouters_1 = require("./Routers/BlogRouter/BlogRouters");
var PostRouter_1 = require("./Routers/PostRouter/PostRouter");
var UserRouter_1 = require("./Routers/UserRouter/UserRouter");
var AuthRouter_1 = require("./Routers/AuthRouter/AuthRouter");
var test_router_1 = require("./Routers/test-router/test-router");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use(settings_1.ROUTERS_SETTINGS.BLOG.blogs, BlogRouters_1.BlogRouter);
exports.app.use(settings_1.ROUTERS_SETTINGS.POST.post, PostRouter_1.PostRouter);
exports.app.use(settings_1.ROUTERS_SETTINGS.TEST.test, test_router_1.TestRouter);
exports.app.use(settings_1.ROUTERS_SETTINGS.USER.user, UserRouter_1.UserRouter);
exports.app.use(settings_1.ROUTERS_SETTINGS.AUTH.auth, AuthRouter_1.AuthRouter);
