import { CommentMongoViewType, CommentViewModelType } from "../../../Applications/Types-Models/Comment/CommentTypes";


export const CommentsMap = {
    /* 
    * 1. Takes comment data.
    * 2. Maps the comment`s model view for service when creating new comment item.
    * 3. Returns a structured object.
    */
    async CommentCreateMap (data: CommentMongoViewType): Promise<CommentViewModelType> {
      return {
        id: data._id.toString(),
        content: data.content,
        commentatorInfo: {
          userId: data.commentatorInfo.userId,
          userLogin: data.commentatorInfo.userLogin
        },
        createdAt: data.createdAt
      }
    }
}
