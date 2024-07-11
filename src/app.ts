import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { ROUTERS_SETTINGS } from './settings'
import { BlogRouter } from './Routers/BlogRouter/BlogRouters'
import { PostRouter } from './Routers/PostRouter/PostRouter'
import { UserRouter } from './Routers/UserRouter/UserRouter'
import { AuthRouter } from './Routers/AuthRouter/AuthRouter'
import { TestRouter } from './Routers/test-router/test-router'
import { CommentsRouter } from './Routers/CommentsRouter/CommentsRouter'
import UserAgent  from 'express-useragent'
import { SecurityRouter } from './Routers/SecurityRouter/SecurityRouter'
 

export const app = express()
app.set('trust proxy', true)
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(UserAgent.express());


app.use(ROUTERS_SETTINGS.BLOG.blogs, BlogRouter)
app.use(ROUTERS_SETTINGS.POST.post, PostRouter)
app.use(ROUTERS_SETTINGS.TEST.test, TestRouter)
app.use(ROUTERS_SETTINGS.USER.user, UserRouter)
app.use(ROUTERS_SETTINGS.AUTH.auth, AuthRouter)
app.use(ROUTERS_SETTINGS.COMMENTS.comments, CommentsRouter)
app.use(ROUTERS_SETTINGS.SECURITY.security, SecurityRouter)



