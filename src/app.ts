import express from 'express'
import cors from 'cors'
import { ROUTERS_SETTINGS, SETTINGS } from './settings'
import { BlogRouter } from './Routers/BlogRouter/BlogRouters'
import { PostRouter } from './Routers/PostRouter/PostRouter'
import { UserRouter } from './Routers/UserRouter/UserRouter'
import { AuthRouter } from './Routers/AuthRouter/AuthRouter'
import { TestRouter } from './Routers/test-router/test-router'

export const app = express()

app.use(express.json())
app.use(cors())

app.use(ROUTERS_SETTINGS.BLOG.blogs, BlogRouter)
app.use(ROUTERS_SETTINGS.POST.post, PostRouter)
app.use(ROUTERS_SETTINGS.TEST.test, TestRouter)
app.use(ROUTERS_SETTINGS.USER.user, UserRouter)
app.use(ROUTERS_SETTINGS.AUTH.auth, AuthRouter)
