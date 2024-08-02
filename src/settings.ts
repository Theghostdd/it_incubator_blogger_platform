import { config } from 'dotenv'
config()


export const ROUTERS_SETTINGS = {
    BLOG: {
        blogs: '/api/blogs',
        blogs_posts: '/posts',
    },
    POST: {
        post: '/api/posts',
        comments: '/comments',
        like_status: "/like-status",
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
        refresh_token: '/refresh-token',
        logout: '/logout',
        password_recovery: '/password-recovery',
        new_password: '/new-password'
    },
    COMMENTS: {
        comments: '/api/comments',
        like_status: "/like-status",


    },
    TEST: {
        test: '/api/testing',
        test_all_data: '/all-data'
    },
    SECURITY: {
        'security': '/api/security',
        'devices': '/devices'
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
        comments: 'comments',
        request_limit: 'request_limit',
        auth_session: 'auth_session',
        recovery_pass_session: 'recovery_pass_session',
        comments_like: 'comments_like'
    }
}

export const SETTINGS = {
    PORT: process.env.PORT || "3000",
    SALTRounds: 10,
    JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY || "SecretKey",
    JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY || "SecretKey2",
    JWTAccessToken_Expires: '5m',
    JWTRefreshToken_Expires: '1h',
}

export const AuthData = [
    {
        login: "admin",
        encode: "YWRtaW46cXdlcnR5"
    }
]

export const MAIL_SETTINGS = {
    MAIL_SERVICE: 'gmail',
    MAIL_HOST: 'smtp.gmail.com',
    MAIL_PORT: 465,
    MAIL_SECURE: true,
    MAIL_IGNORE_TLS: true,
    MAIL_FROM: {
        address: 'mixailmar4uk78@gmail.com',
        name: 'Mikhail',
        password: process.env.PASSWORD_MAIL_AGENT || 'somepassformail'
    }
}