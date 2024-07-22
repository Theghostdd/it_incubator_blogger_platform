import {CreatePaginationType, ResultDataWithPaginationType} from "../../../Applications/Types-Models/BasicTypes";
import { CommentMongoViewType, CommentViewModelType } from "../../../Applications/Types-Models/Comment/CommentTypes";


export const CommentsMap = {
    /*
    * Maps the comment`s model view.
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
    * Maps the comment`s models view, if comment not found return empty array.
    */
        async MapComments (data: CommentMongoViewType[], pagination: CreatePaginationType): Promise<ResultDataWithPaginationType<CommentViewModelType[]>> {
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
