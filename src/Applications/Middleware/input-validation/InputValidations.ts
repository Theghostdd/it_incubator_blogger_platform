import { NextFunction, Response, Request } from "express";
import { body, validationResult, Result } from 'express-validator';
import { BlogQueryRepositories } from "../../../Repositories/BlogRepositories/BlogQueryRepositories";

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

export const RuleValidations = {
    validName: body("name")
        .isString()
        .withMessage("The name must be a string")
        .trim()
        .isLength({ min: 1, max: 15 })
        .withMessage(
            "The name can`t be empty and must contain between 1 and 15 characters"
        ),
    validDescription: body("description")
        .isString()
        .withMessage("The description must be a string")
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage(
            "The description can`t be empty and must contain between 1 and 500 characters"
        ),
    validWebsiteUrl: body("websiteUrl")
        .isString()
        .withMessage("The web site URL must be a string")
        .trim()
        .isLength({ min: 13, max: 100 })
        .withMessage(
            "The web site URL can`t be empty and must contain between 13 and 100 characters"
        )
        .matches("^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$")
        .withMessage("The web site URL is invalid"),
    validTitle: body("title")
        .isString()
        .withMessage("The title must be a string")
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage(
            "The title can`t be empty and must contain between 1 and 30 characters"
        ),
    validShortDescription: body("shortDescription")
        .isString()
        .withMessage("The short description must be a string")
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage(
            "The short description  can`t be empty and must contain between 1 and 100 characters"
        ),
    validContent: body("content")
        .isString()
        .withMessage("The content must be a string")
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage(
            "The content  can`t be empty and must contain between 1 and 1000 characters"
        ),
    validBlogId: body("blogId")
        .isString()
        .withMessage("The blog id must be a string")
        .trim()
        .notEmpty()
        .withMessage("The blog id can`t be empty")
        .custom(async (id: string) => {
            const result = await BlogQueryRepositories.GetBlogById(id);
            if (result) {
                return true;
            }
            throw new Error("Blog id not found");
            }),
    validLogin: body("login")
        .isLength({ min: 3, max: 10 })
        .matches("^[a-zA-Z0-9_-]*$")
        .withMessage("Login is bad"),
    validPassword: body("password")
        .isLength({ min: 6, max: 20 })
        .withMessage('Password is bad'),
    validEmail: body("email")
        .notEmpty()
        .matches(`^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$`)
        .withMessage('Email is bad'), 
    validLoginOrEmail: body('loginOrEmail')
        .notEmpty()
        .isLength({max: 20})
        .custom((value) => {
            const isLoginValid = value.length >= 3 && value.length <= 10 && /^[a-zA-Z0-9_-]*$/.test(value);
            const isEmailValid = /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
    
            if (!isLoginValid && !isEmailValid) {
                throw new Error();
            }
    
            return true;
        })
        .withMessage('Bad login or email'),
    validContentComment: body('content')
        .trim()
        .isLength({min: 20, max: 300}),
    validConfirmCode: body('code')
        .trim()
        .notEmpty()
        .isLength({min: 1}),
    validNewPassword: body("newPassword")
        .isLength({ min: 6, max: 20 })
        .withMessage('Password is bad'),
    validRecoveryCode: body("recoveryCode")
        .notEmpty()
        .withMessage('Code is bad'),

};



