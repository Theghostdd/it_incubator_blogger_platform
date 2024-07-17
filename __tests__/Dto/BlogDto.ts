
export const BlogDto = {
    CreateBlogData: {
        name: "My Blog",
        description: "This is my blog",
        websiteUrl: "https://my-blog.ru"
    },

    UpdateBlogData: {
        name: "My New Blog",
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
    }
}