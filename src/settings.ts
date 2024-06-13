import { config } from 'dotenv'
config()

export const SETTINGS = {
    PORT: process.env.PORT || "3000",
    PATH: {
        BLOG: "/api/blogs",
        POST: "/api/posts",
        USER: '/api/users',
        AUTH: '/api/auth',
        additionalBlog: {
            posts: 'posts'
        },
        additionalAuth: {
            login: 'login'
        }
    },
    PATH_TEST: {
        TEST: "/api/testing",
        TEST_ALL_DATA: "/all-data"
    },
    MONGO: {
        URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
        URL_CLOUD: process.env.MONGO_CLOUD_ULR || 'mongodb://0.0.0.0:27017',
        SECRET_KEY: process.env.SECRET_KEY || 'YOURSECRETKEYGOESHERE',
        DB_NAME: 'blog_platform',
        COLLECTIONS: {
            posts: 'posts',
            blogs: 'blogs',
            users: 'users'
        }
    },
    SALTRounds: 10

}

export const AuthData = [
    {
        login: "admin",
        encode: "YWRtaW46cXdlcnR5"
    }
]