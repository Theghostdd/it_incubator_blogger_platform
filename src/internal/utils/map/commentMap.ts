import {ResultDataWithPaginationType} from "../../../Applications/Types-Models/BasicTypes";
import {CommentMongoViewType, CommentViewModelType} from "../../../features/comment/comment-types";


export const commentMap = {

    async mapComment (data: CommentMongoViewType): Promise<CommentViewModelType> {
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

    async mapComments (data: CommentMongoViewType[], pagesCount: number, page: number, pageSize: number, totalCount: number ): Promise<ResultDataWithPaginationType<CommentViewModelType[]>> {
          return {
              pagesCount: pagesCount,
              page: page,
              pageSize: pageSize,
              totalCount: totalCount,
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
