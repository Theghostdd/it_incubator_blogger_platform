import {RegistrationDto} from "./AuthDto";

export const BlogDto = {
    CreateBlogData: {
        name: "My blog",
        description: "This is my blog",
        websiteUrl: "https://my-blog.ru"
    },

    UpdateBlogData: {
        name: "My New blog",
        description: "This is my new blog",
        websiteUrl: "https://my-new-blog.ru"
    }
}

export const BlogInsert = {
    BlogInsertData: {
        name: BlogDto.CreateBlogData.name,
        description: BlogDto.CreateBlogData.description,
        websiteUrl: BlogDto.CreateBlogData.websiteUrl,
        createdAt: "2024-07-06T13:41:33.211Z",
        isMembership: false
    },

    CreateManyData: [
        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },
        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

        {
            content: "string",
            commentatorInfo: {
                userId: '',
                userLogin: RegistrationDto.RegistrationUserData.login
            },
            postInfo: {
                postId: ''
            },
            blogInfo: {
                blogId: ''
            },
            likesInfo: {
                dislikesCount: 0,
                likesCount: 0,
            },
            createdAt: '2024-06-20T15:00:01.817Z'
        },

    ]
}