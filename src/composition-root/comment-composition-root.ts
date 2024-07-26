import {CommentController} from "../features/comment/comment-controller";
import {CommentModel} from "../Domain/Comment/Comment";
import {CommentQueryRepositories} from "../features/comment/comment-query-repositories";
import {CommentRepositories} from "../features/comment/comment-repositories";
import {CommentService} from "../features/comment/comment-service";


export const commentQueryRepositories = new CommentQueryRepositories(CommentModel)
export const commentRepositories = new CommentRepositories(CommentModel)
export const commentService = new CommentService(commentRepositories);
export const commentController = new CommentController(commentService, commentQueryRepositories);