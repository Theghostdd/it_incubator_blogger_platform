import express from 'express'
import cors from 'cors'
import { SETTINGS } from './settings'
import { BlogRouter } from './Routers/BlogRouter/BlogRouters'
import { PostRouter } from './Routers/PostRouter/PostRouter'
import { TestRouter } from './Routers/TestRouter/TestRouter'
import { UserRouter } from './Routers/UserRouter/UserRouter'
import { AuthRouter } from './Routers/AuthRouter/AuthRouter'

export const app = express()

app.use(express.json())
app.use(cors())

app.use(SETTINGS.PATH.BLOG, BlogRouter)
app.use(SETTINGS.PATH.POST, PostRouter)
app.use(SETTINGS.PATH_TEST.TEST, TestRouter)
app.use(SETTINGS.PATH.USER, UserRouter)
app.use(SETTINGS.PATH.AUTH, AuthRouter)
