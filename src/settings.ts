import { config } from 'dotenv'
config()


export const ROUTERS_SETTINGS = {
    BLOG: {
        blogs: '/api/blogs',
        blogs_posts: '/posts',
    },
    POST: {
        post: '/api/posts',
        comments: '/comments'
    },
    USER: {
        user: '/api/users'
    },
    AUTH: {
        auth: '/api/auth',
        login: '/login',
        me: '/me',
        registration: '/registration',
        registration_confirmation: '/registration-confirmation',
        registration_email_resending: '/registration-email-resending',
    },
    COMMENTS: {
        comments: '/api/comments'
    },
    TEST: {
        test: '/api/testing',
        test_all_data: '/all-data'
    }
}

export const MONGO_SETTINGS = {
    URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    URL_CLOUD: process.env.MONGO_CLOUD_ULR || 'mongodb://0.0.0.0:27017',
    DB_NAME: 'blog_platform',
    COLLECTIONS: {
        posts: 'posts',
        blogs: 'blogs',
        users: 'users',
        comments: 'comments'
    }
}

export const SETTINGS = {
    PORT: process.env.PORT || "3000",
    SALTRounds: 10,
    JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY || "SecretKey"
}

export const AuthData = [
    {
        login: "admin",
        encode: "YWRtaW46cXdlcnR5"
    }
]

export const MAIL_SETTINGS = {
    MAIL_SERVICE: 'gmail',
    MAIL_FROM: {
        address: 'mixailmar4uk78@gmail.com',
        name: 'Mikhail',
        password: process.env.PASSWORD_MAIL_AGENT || 'somepassformail'
    }
}