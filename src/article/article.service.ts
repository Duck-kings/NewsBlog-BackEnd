import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { FileService } from 'src/services/file/file.service';

import { ArticleDto, createArticleDto, formDataArticleDto } from 'src/dto';
import { Article } from 'src/schemas/article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    private readonly fileService: FileService
  ) {}

  async create(
    articleData: formDataArticleDto,
    file: Express.Multer.File
  ): Promise<ArticleDto> {
    try {
      const articleObj: createArticleDto = JSON.parse(articleData.article);
      const pathToImg = this.fileService.createPath(
        file,
        articleObj.author._id
      );

      const article: createArticleDto = { ...articleObj, img: pathToImg };
      const createdArticle = await this.articleModel.create(article);

      return (await createdArticle.populate('author')).populate('comments');
    } catch (error) {
      return error;
    }
  }

  async delete(article: ArticleDto): Promise<ArticleDto> {
    try {
      const deletedArticle = await this.articleModel
        .findOneAndDelete<ArticleDto>({ _id: article._id })
        .populate('author')
        .exec();

      const fileName = deletedArticle.img.split('/').pop();

      this.fileService.deleteFile(fileName);

      return deletedArticle;
    } catch (error) {
      return error;
    }
  }

  async update(article: ArticleDto): Promise<ArticleDto> {
    try {
      const updatedArticle = await this.articleModel
        .findOneAndUpdate<ArticleDto>({ _id: article._id }, article, {
          returnDocument: 'after'
        })
        .exec();

      return updatedArticle;
    } catch (error) {
      return error;
    }
  }

  async getAll(): Promise<ArticleDto[]> {
    const articles = await this.articleModel
      .find<ArticleDto>()
      .populate('author')
      .populate('comments')
      .exec();

    if (!articles.length) {
      return [];
    }

    return articles;
  }

  async getOne(
    articleId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId
  ): Promise<ArticleDto> {
    try {
      const article = await this.articleModel
        .findOne<ArticleDto>({ _id: articleId })
        .populate('author')
        .populate({
          path: 'comments',
          populate: {
            path: 'author'
          }
        })
        .exec();

      if (!article) {
        throw new HttpException('Cant`t get Article', HttpStatus.BAD_REQUEST);
      }

      const isAuthor: boolean = String(userId) === String(article.author._id);
      const isViewed: boolean = article.views.includes(userId);

      if (isAuthor || isViewed) {
        return article;
      }

      const updatedArticle = await this.articleModel
        .findOneAndUpdate<ArticleDto>(
          { _id: articleId },
          { views: [...article.views, userId] },
          {
            returnDocument: 'after'
          }
        )
        .exec();

      return updatedArticle;
    } catch (error) {
      return error;
    }
  }

  async getMyAll(
    authorId: mongoose.Schema.Types.ObjectId
  ): Promise<ArticleDto[]> {
    const articles = await this.articleModel
      .find<ArticleDto>({
        author: authorId
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'author'
        }
      })
      .exec();

    if (!articles.length) {
      return [];
    }

    return articles;
  }
}
