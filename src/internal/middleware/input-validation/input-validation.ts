import { NextFunction, Response, Request } from "express";
import { body, validationResult, Result } from 'express-validator';
import {BlogQueryRepositories} from "../../../features/blog/api/blog-query-repositories";
import {LikeStatusEnum} from "../../../typings/basic-types";
import {container} from "../../../composition-root/composition-root";
import {BlogViewModelType} from "../../../features/blog/blog-types";

export const inputValidation = (req: Request, res: Response, next: NextFunction) => {
    const error: Result = validationResult(req)

    if (error.array().length > 0) {
        return res.status(400).json({
            errorsMessages: error.array({onlyFirstError: true}).map( (e) => ({
                    message: e.msg,
                    field: e.path
                })
            )})

    }
    return next()
}

export const ruleBodyValidations = {
    validationBodyName: body("name")
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 15 }),
    validationBodyDescription: body("description")
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 500 }),
    validationBodyWebsiteUrl: body("websiteUrl")
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 13, max: 100 })
        .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$"),
    validationBodyTitle: body("title")
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 30 }),
    validationBodyShortDescription: body("shortDescription")
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 100 }),
    validationBodyContent: body("content")
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 1, max: 1000 }),
    validationBodyBlogId: body("blogId")
        .trim()
        .notEmpty()
        .isMongoId()
        .custom(async (id: string) => {
            const result: BlogViewModelType | null = await container.resolve(BlogQueryRepositories).getBlogById(id);
            if (result) {
                return true;
            }
            throw new Error("blog id not found");
        }),
    validationBodyLogin: body("login")
        .trim()
        .notEmpty()
        .isLength({ min: 3, max: 10 })
        .matches("^[a-zA-Z0-9_-]*$"),
    validationBodyPassword: body("password")
        .trim()
        .notEmpty()
        .isLength({ min: 6, max: 20 }),
    validationBodyEmail: body("email")
        .trim()
        .notEmpty()
        .isLength({ min: 6})
        .matches(`^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`),
    validationBodyLoginOrEmail: body('loginOrEmail')
        .trim()
        .notEmpty()
        .isLength({max: 20})
        .custom((value) => {
            const isLoginValid = value.length >= 3 && value.length <= 10 && /^[a-zA-Z0-9_-]*$/.test(value);
            const isEmailValid = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            if (!isLoginValid && !isEmailValid) {
                throw new Error();
            }

            return true;
        }),
    validationBodyContentComment: body('content')
        .trim()
        .notEmpty()
        .isLength({min: 20, max: 300}),
    validationBodyConfirmCode: body('code')
        .trim()
        .notEmpty(),
    validationBodyNewPassword: body("newPassword")
        .trim()
        .notEmpty()
        .isLength({ min: 6, max: 20 }),
    validationBodyRecoveryCode: body("recoveryCode")
        .trim()
        .notEmpty(),
    validationBodyLikeStatus: body('likeStatus')
        .trim()
        .notEmpty()
        .isIn(Object.values(LikeStatusEnum))
};


