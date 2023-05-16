import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Comment } from './comment.schema';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
  @Prop({
    type: String,
    required: false,
    default: 'path to img folder'
  })
  img: string;

  @Prop({
    type: String,
    required: true
  })
  title: string;

  @Prop({
    type: String,
    required: true
  })
  description: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    default: []
  })
  views: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    required: false,
    default: []
  })
  comments: Comment[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  })
  author: User;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
