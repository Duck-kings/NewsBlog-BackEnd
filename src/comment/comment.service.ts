import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { CommentDto, createCommentDto } from 'src/dto';
import { Article } from 'src/schemas/article.schema';
import { Comment } from 'src/schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(Article.name) private articleModel: Model<Article>
  ) {}

  async create(comment: createCommentDto): Promise<CommentDto> {
    try {
      const createdComment = await this.commentModel.create(comment);

      const article = await this.articleModel
        .findOne({
          _id: comment.articleId
        })
        .exec();

      if (!createdComment) {
        throw new HttpException('Wrong incoming data', HttpStatus.BAD_REQUEST);
      }

      article.comments.push(createdComment);

      article.save();

      return await createdComment.populate('author');
    } catch (error) {
      return error;
    }
  }

  async delete(
    comment: CommentDto,
    authorId: mongoose.Schema.Types.ObjectId
  ): Promise<CommentDto> {
    try {
      const isAuthor: boolean = comment.author._id === authorId;

      if (!isAuthor) {
        throw new HttpException('Can`t delete comment', HttpStatus.BAD_REQUEST);
      }

      const deletedComment = await this.commentModel
        .findOneAndDelete<CommentDto>({ _id: comment._id })
        .exec();

      if (!deletedComment) {
        throw new HttpException('Can`t delete comment', HttpStatus.BAD_REQUEST);
      }

      await this.articleModel
        .findOneAndUpdate(
          {
            _id: comment.articleId
          },
          {
            $pull: { comments: comment._id }
          },
          {
            returnDocument: 'after'
          }
        )
        .exec();

      return deletedComment;
    } catch (error) {
      return error;
    }
  }
}
