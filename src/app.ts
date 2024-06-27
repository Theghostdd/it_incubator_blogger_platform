import express, { NextFunction } from 'express'
import cors from 'cors'
import { ROUTERS_SETTINGS, SETTINGS } from './settings'
import { BlogRouter } from './Routers/BlogRouter/BlogRouters'
import { PostRouter } from './Routers/PostRouter/PostRouter'
import { UserRouter } from './Routers/UserRouter/UserRouter'
import { AuthRouter } from './Routers/AuthRouter/AuthRouter'
import { TestRouter } from './Routers/test-router/test-router'
import { CommentsRouter } from './Routers/CommentsRouter/CommentsRouter'
import { Router, Request, Response } from "express";


export const app = express()

let MemoryRequest: any = []

app.use(async (req: Request, res: Response, next: NextFunction) => {
    if (MemoryRequest.includes(req.ip)) {
        return res.status(400).json({errorRequest: `a lot of request, try again later your IP: ${req.ip}`, })
    }
    MemoryRequest.push(req.ip)
    setTimeout(() => {
        MemoryRequest = []
    }, 10000)
    next()
}) 

app.use(express.json())
app.use(cors())

app.use(ROUTERS_SETTINGS.BLOG.blogs, BlogRouter)
app.use(ROUTERS_SETTINGS.POST.post, PostRouter)
app.use(ROUTERS_SETTINGS.TEST.test, TestRouter)
app.use(ROUTERS_SETTINGS.USER.user, UserRouter)
app.use(ROUTERS_SETTINGS.AUTH.auth, AuthRouter)
app.use(ROUTERS_SETTINGS.COMMENTS.comments, CommentsRouter)
