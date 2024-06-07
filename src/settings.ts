import { config } from 'dotenv'
config()

export const SETTINGS = {
    PORT: process.env.PORT || "3000",
    PATH: {
        BLOG: "/api/blogs",
        POST: "/api/posts"
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
            blogs_post: 'blogs_post'
        }
    },

}

export const AuthData = [
    {
        login: "admin",
        encode: "YWRtaW46cXdlcnR5"
    }
]