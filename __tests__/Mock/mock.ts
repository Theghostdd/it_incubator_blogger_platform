import { ObjectId } from "mongodb";
import { BlogRepositories } from "../../src/Repositories/BlogRepositories/BlogRepositories";
import { defaultBlogValues } from "../../src/Utils/default-values/Blog/default-blog-value";
import { BlogMapper } from "../../src/Utils/map/Blog/BlogMap";


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

