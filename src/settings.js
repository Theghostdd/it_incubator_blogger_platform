"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthData = exports.SETTINGS = exports.MONGO_SETTINGS = exports.ROUTERS_SETTINGS = void 0;
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.ROUTERS_SETTINGS = {
    BLOG: {
        blogs: '/api/blogs',
        blogs_posts: '/posts'
    },
    POST: {
        post: '/api/posts'
    },
    USER: {
        user: '/api/users'
    },
    AUTH: {
        auth: '/api/auth',
        login: '/login'
    },
    TEST: {
        test: '/api/testing',
        test_all_data: '/all-data'
    }
};
exports.MONGO_SETTINGS = {
    URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    URL_CLOUD: process.env.MONGO_CLOUD_ULR || 'mongodb://0.0.0.0:27017',
    DB_NAME: 'blog_platform',
    COLLECTIONS: {
        posts: 'posts',
        blogs: 'blogs',
        users: 'users'
    }
};
exports.SETTINGS = {
    PORT: process.env.PORT || "3000",
    SALTRounds: 10
};
exports.AuthData = [
    {
        login: "admin",
        encode: "YWRtaW46cXdlcnR5"
    }
];
