import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ROUTERS_SETTINGS } from './settings'
import UserAgent  from 'express-useragent'
import {testRouter} from "./features/test/test-router";
import {blogRouter} from "./features/blog/api/blog-router";
import {postRouter} from "./features/post/api/post-router";
import {userRouter} from "./features/user/api/user-router";
import {authRouter} from "./features/auth-registration/api/auth-router";
import {commentsRouter} from "./features/comment/api/comment-router";
import {securityRouter} from "./features/security-device/api/security-device-router";
 

export const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(UserAgent.express());


app.use(ROUTERS_SETTINGS.BLOG.blogs, blogRouter)
app.use(ROUTERS_SETTINGS.POST.post, postRouter)
app.use(ROUTERS_SETTINGS.TEST.test, testRouter)
app.use(ROUTERS_SETTINGS.USER.user, userRouter)
app.use(ROUTERS_SETTINGS.AUTH.auth, authRouter)
app.use(ROUTERS_SETTINGS.COMMENTS.comments, commentsRouter)
app.use(ROUTERS_SETTINGS.SECURITY.security, securityRouter)



