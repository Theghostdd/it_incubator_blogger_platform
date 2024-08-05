import { BlogDto } from "./BlogDto"


export const PostDto = {
    CreatePostData: {
        title: "My first post",
        shortDescription: "My short description",
        content: "This is content",
        blogId: '',
        blogName: BlogDto.CreateBlogData.name,
    },

    UpdatePostData: {
        title: "My first post 2",
        shortDescription: "My short description 2",
        content: "This is content 2",
        blogId: ''
    },

    CommentData: {
        content: 'Some content'
    }
};

export const InsertPost = {
    InsertPostData: {
        title: PostDto.CreatePostData.title,
        shortDescription: PostDto.CreatePostData.shortDescription,
        content: PostDto.CreatePostData.content,
        blogId: PostDto.CreatePostData.blogId || PostDto.UpdatePostData.blogId,
        blogName: BlogDto.CreateBlogData.name,
        createdAt: '2024-07-18T12:06:19.908Z'
    }
}



