import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ROUTERS_SETTINGS } from './settings'
import { UserRouter } from './Routers/UserRouter/UserRouter'
import { AuthRouter } from './Routers/AuthRouter/AuthRouter'
import { CommentsRouter } from './Routers/CommentsRouter/CommentsRouter'
import UserAgent  from 'express-useragent'
import { SecurityRouter } from './Routers/SecurityRouter/SecurityRouter'
import {testRouter} from "./features/test/test-router";
import {blogRouter} from "./features/blog/blog-router";
import {postRouter} from "./features/post/post-router";
 

export const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(UserAgent.express());


app.use(ROUTERS_SETTINGS.BLOG.blogs, blogRouter)
app.use(ROUTERS_SETTINGS.POST.post, postRouter)
app.use(ROUTERS_SETTINGS.TEST.test, testRouter)
// app.use(ROUTERS_SETTINGS.USER.user, UserRouter)
// app.use(ROUTERS_SETTINGS.AUTH.auth-registration, AuthRouter)
// app.use(ROUTERS_SETTINGS.COMMENTS.comments, CommentsRouter)
// app.use(ROUTERS_SETTINGS.SECURITY.security, SecurityRouter)



