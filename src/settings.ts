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
        TEST_ALL_DATA: "/api/testing/all-data"
    }
}

export const AdminAuth = [
    {
        login: "YWRtaW4=",
        pass: "cXdlcnR5"
    }
]