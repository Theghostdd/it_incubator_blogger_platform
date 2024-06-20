import { BlogQueryParamsType } from "../../../Applications/Types-Models/Blog/BlogTypes"


export const defaultCommentValues = {
    /*
    * Sets default values for creating the new comment.
    */
    async defaultCreateValues () {
        return {
            createdAt: new Date().toISOString(),
        }
    },
}