import { CreatePaginationType } from "../../../Applications/Types-Models/BasicTypes";
import { CommentMongoViewType, CommentViewModelType, CommentsViewModelType } from "../../../Applications/Types-Models/Comment/CommentTypes";


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
    },
    /* 
    * 1. Takes comment data.
    * 2. Maps the comment`s model view for query repositories when getting comment by ID.
    * 3. Returns a structured object.
    */
        async MapComment (data: CommentMongoViewType): Promise<CommentViewModelType> {
          return {
              id: data._id.toString(),
              content: data.content,
              commentatorInfo: {
                userId: data.commentatorInfo.userId,
                userLogin: data.commentatorInfo.userLogin
              },
              createdAt: data.createdAt,
          }
      },
    /* 
    * 1. Takes comment and pagination data.
    * 2. Maps the comment`s models view for query repositories to return all comments data with pagination.
    * 3. If comment data have empty array then 'items' must be empty array.
    * 4. Returns a structured object.
    */
        async MapComments (data: CommentMongoViewType[], pagination: CreatePaginationType): Promise<CommentsViewModelType> {
          return {
              pagesCount: pagination.pagesCount,
              page: pagination.page,
              pageSize: pagination.pageSize,
              totalCount: pagination.totalCount,
              items: data.map((item) => {
                  return {
                      id: item._id.toString(),
                      content: item.content,
                      commentatorInfo: {
                        userId: item.commentatorInfo.userId,
                        userLogin: item.commentatorInfo.userLogin
                      },
                      createdAt: item.createdAt
                  }
              })
      
          }
      },
}
