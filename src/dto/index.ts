import mongoose from 'mongoose';

export interface UserDto {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  pseudonym: string;
  password: string;
}

export interface ArticleDto {
  _id: mongoose.Schema.Types.ObjectId;
  img: string;
  title: string;
  description: string;
  views: mongoose.Schema.Types.ObjectId[];
  comments: CommentDto[];
  author: UserDto;
}

export interface CommentDto {
  _id: mongoose.Schema.Types.ObjectId;
  articleId: mongoose.Schema.Types.ObjectId;
  author: UserDto;
  text: string;
}

export interface registerUserDto {
  firstName: string;
  lastName: string;
  email: string;
  pseudonym: string;
  password: string;
}

export interface loginUserDto {
  email: string;
  password: string;
}

export interface createArticleDto {
  img: string;
  title: string;
  description: string;
  views: mongoose.Schema.Types.ObjectId[];
  comments: CommentDto[];
  author: UserDto;
}

export interface formDataArticleDto {
  article: string; // String(createArticleDto)
}

export interface changeArticleDto extends createArticleDto {
  _id: mongoose.Schema.Types.ObjectId;
}

export interface createCommentDto {
  articleId: mongoose.Schema.Types.ObjectId;
  author: UserDto;
  text: string;
}

export interface tokenDto {
  token: string;
}

export interface idDto {
  id: mongoose.Schema.Types.ObjectId;
}
