import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

import { ComentSchema, Comment } from 'src/schemas/comment.schema';
import { Article, ArticleSchema } from 'src/schemas/article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: ComentSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Article.name,
        schema: ArticleSchema
      }
    ])
  ],
  providers: [CommentService],
  controllers: [CommentController]
})
export class CommentModule {}
