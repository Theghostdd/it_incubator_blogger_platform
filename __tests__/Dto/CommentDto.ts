import { RegistrationDto } from "./AuthDto"
import { PostDto } from "./PostDto"


export const CommentDto = {
    UpdateComment: {
        content: "My update comment content"
    }
}

export const InsertComment = {
    InsertCommentData: {
        content: PostDto.CommentData.content,
        commentatorInfo: {
            userId: '',
            userLogin: RegistrationDto.RegistrationUserData.login
        },
        blogInfo: {
            blogId: ''
        },
        postInfo: {
            postId: ''
        },
        createdAt: "2024-07-06T13:41:33.211Z"
    }
}