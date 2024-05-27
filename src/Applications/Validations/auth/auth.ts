import { NextFunction, Response, Request, query } from "express";
import { AuthData } from "../../../settings";

export const authValidation = async (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.sendStatus(401)
    }
    try {
        const SplitString = auth.split(' ')[0]
        if (SplitString !== "Basic") {
            return res.sendStatus(401)
        }

        const Data = auth.split(' ')[1]
        const decode = Buffer.from(Data, 'base64').toString('utf8');
        const SplitLogin = decode.split(':')[0]
        for (let i in AuthData) {
            if (AuthData[i].login === SplitLogin) {
                if (AuthData[i].encode === Data) {
                    return next()
                }
                return res.sendStatus(401)
            }
            return res.sendStatus(401)
        }
    } catch (e) {
        return res.sendStatus(400)
    }

    return res.sendStatus(401)
}