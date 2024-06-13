import { CreatePaginationType, CreatedMongoSuccessType } from "../../Applications/Types-Models/BasicTypes"
import { BlogCreateInputModelType, BlogViewModelType, BlogViewMongoModelType, BlogsViewModelType } from "../../Applications/Types-Models/Blog/BlogTypes"
import { PostCreateInputModelType, PostViewModelType, PostViewMongoModelType, PostsViewModelType } from "../../Applications/Types-Models/Post/PostTypes"
import { UserCreateInputModelType, UserViewModelType, UserViewMongoModelType, UsersViewModelType } from "../../Applications/Types-Models/User/UserTypes"



export const map = {
    async mapBlogs (data: BlogViewMongoModelType[], pagination: CreatePaginationType): Promise<BlogsViewModelType> {
        return {
            pagesCount: pagination.pagesCount,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalCount: pagination.totalCount,
            items: data.map((item) => {
                return {
                    id: item._id.toString(),
                    name: item.name,
                    description: item.description,
                    websiteUrl: item.websiteUrl,
                    createdAt: item.createdAt,
                    isMembership: item.isMembership
                }
            })

        }
    },

    async mapBlog (data: BlogCreateInputModelType | BlogViewMongoModelType, mongoSuc: CreatedMongoSuccessType | null): Promise<BlogViewModelType> {
        return {
            id: mongoSuc ? mongoSuc.insertedId.toString() : ('_id' in data ? data._id.toString() : (() => { throw new Error('ID Not transmitted') })()),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl,
            createdAt: data.createdAt,
            isMembership: data.isMembership
        }
    },

    async mapPosts (data: PostViewMongoModelType[], pagination: CreatePaginationType): Promise<PostsViewModelType> {
        return {
            pagesCount: pagination.pagesCount,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalCount: pagination.totalCount,
            items: data.map((item) => {
                return {
                    id: item._id.toString(),
                    title: item.title,
                    shortDescription: item.shortDescription,
                    content: item.content,
                    blogId: item.blogId,
                    blogName: item.blogName,
                    createdAt: item.createdAt
                }
            })

        }
    },

    async mapPost (data: PostCreateInputModelType | PostViewMongoModelType , mongoSuc: CreatedMongoSuccessType | null): Promise<PostViewModelType> {
        return {
            id: mongoSuc ? mongoSuc.insertedId.toString() : ('_id' in data ? data._id.toString() : (() => { throw new Error('ID Not transmitted') })()),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId: data.blogId,
            blogName: data.blogName,
            createdAt: data.createdAt
        }
    },

    async mapUsers (data: UserViewMongoModelType[], pagination: CreatePaginationType): Promise<UsersViewModelType> {
        return {
            pagesCount: pagination.pagesCount,
            page: pagination.page,
            pageSize: pagination.pageSize,
            totalCount: pagination.totalCount,
            items: data.map((item) => {
                return {
                    id: item._id.toString(),
                    login: item.login,
                    email: item.email,
                    createdAt: item.createdAt
                }
            })

        }
    },

    async mapUser (data: UserCreateInputModelType | UserViewMongoModelType , mongoSuc: CreatedMongoSuccessType | null): Promise<UserViewModelType> {
        return {
            id: mongoSuc ? mongoSuc.insertedId.toString() : ('_id' in data ? data._id.toString() : (() => { throw new Error('ID Not transmitted') })()),
            login: data.login,
            email: data.email,
            createdAt: data.createdAt
        }
    },

}