import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { FileService } from 'src/services/file/file.service';

import { Article, ArticleSchema } from 'src/schemas/article.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }])
  ],
  controllers: [ArticleController],
  providers: [ArticleService, FileService]
})
export class ArticleModule {}
