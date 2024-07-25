import {Request, Response} from "express";

export interface iTestController {
    clearDb(req: Request, res: Response): Promise<Response>
}

export interface iTestService {
    clearAllDb(): Promise<void>
}

export interface iTestRepositories {
    deleteManyAllData(): Promise<void>
}