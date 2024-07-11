import { ObjectId } from "mongodb";
import { BlogRepositories } from "../../src/Repositories/BlogRepositories/BlogRepositories";
import { defaultBlogValues } from "../../src/Utils/default-values/Blog/default-blog-value";
import { BlogMapper } from "../../src/Utils/map/Blog/BlogMap";
import { AuthRepositories } from "../../src/Repositories/AuthRepositories/AuthRepositories";


export const BlogMock = {
    DefaultBlogValuesMock () {
        defaultBlogValues.defaultCreateValues = jest.fn().mockImplementation(() => true)
    },

    CreateBlogMock () {
        BlogRepositories.CreateBlog = jest.fn().mockImplementation((data) => {return {insertedId: new ObjectId('66632242575d379aaed930d7')}})
    },

    GetBlogByIdWithoutMapMock () {
        BlogRepositories.GetBlogByIdWithoutMap = jest.fn().mockImplementation(() => true);
    },

    UpdateBlogByIdMockResolve () {
        BlogRepositories.UpdateBlogById = jest.fn().mockImplementation(() => { return {matchedCount: 1}})
    }, 

    UpdateBlogByIdMockRejected () {
        BlogRepositories.UpdateBlogById = jest.fn().mockImplementation(() => { return {matchedCount: 0}})
    }, 
    
    MapCreatedBlog () {
        BlogMapper.MapCreatedBlog = jest.fn().mockImplementation(() => true)
    }
}

export const AuthMock = {
    GetUsersRequestByIpAndUrlMockResolve () {
        AuthRepositories.GetUsersRequestByIpAndUrl = jest.fn().mockImplementation(() => true)
    },

    GetUsersRequestByIpAndUrlMockRejected () {
        AuthRepositories.GetUsersRequestByIpAndUrl = jest.fn().mockImplementation(() => false)
    },

    UpdateRequestByIdMock () {
        AuthRepositories.UpdateRequestById = jest.fn().mockImplementation(() => true)
    }
}
