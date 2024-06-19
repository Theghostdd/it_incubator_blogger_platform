import { ObjectId } from "mongodb";
import { CommentCreateType, CommentMongoViewType, CommentViewModelType } from "../../../Applications/Types-Models/Comment/CommentTypes";




export const CommentsMap = {
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
