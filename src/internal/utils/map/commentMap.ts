import {LikeStatusEnum, ResultDataWithPaginationType} from "../../../typings/basic-types";
import {CommentDtoViewType, CommentMongoViewType, CommentViewModelType} from "../../../features/comment/comment-types";


export const commentMap = {

    mapComment (data: CommentMongoViewType, userLikeStatus: LikeStatusEnum): CommentViewModelType {
          return {
              id: data._id.toString(),
              content: data.content,
              commentatorInfo: {
                userId: data.commentatorInfo.userId,
                userLogin: data.commentatorInfo.userLogin
              },
              likesInfo: {
                  likesCount: data.likesInfo.likesCount,
                  dislikesCount: data.likesInfo.dislikesCount,
                  myStatus: userLikeStatus
              },
              createdAt: data.createdAt,
          }
      },

    mapComments (data: CommentDtoViewType[], pagesCount: number, page: number, pageSize: number, totalCount: number ): ResultDataWithPaginationType<CommentViewModelType[] | []> {
          return {
              pagesCount: +pagesCount,
              page: +page,
              pageSize: +pageSize,
              totalCount: +totalCount,
              items: data.map((item) => {
                  return {
                      id: item._id.toString(),
                      content: item.content,
                      commentatorInfo: {
                        userId: item.commentatorInfo.userId,
                        userLogin: item.commentatorInfo.userLogin
                      },
                      likesInfo: {
                          likesCount: item.likesInfo.likesCount,
                          dislikesCount: item.likesInfo.dislikesCount,
                          myStatus: item.statusUserLike
                      },
                      createdAt: item.createdAt
                  }
              })
      
          }
      },
}
