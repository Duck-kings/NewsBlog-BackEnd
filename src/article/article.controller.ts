import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import mongoose from 'mongoose';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { ArticleService } from './article.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ArticleDto, UserDto, formDataArticleDto } from 'src/dto';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  getAll(): Promise<ArticleDto[]> {
    return this.articleService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getOne/:id')
  getOne(
    @Param('id') id: mongoose.Schema.Types.ObjectId,
    @Req() req: Request
  ): Promise<ArticleDto> {
    const { _id } = req.user as UserDto;
    return this.articleService.getOne(id, _id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getMyAll')
  getMyAll(@Req() req: Request) {
    const { _id } = req.user as UserDto;
    return this.articleService.getMyAll(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() article: formDataArticleDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ArticleDto> {
    return this.articleService.create(article, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  delete(@Body() article: ArticleDto): Promise<ArticleDto> {
    return this.articleService.delete(article);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  update(@Body() article: ArticleDto): Promise<ArticleDto> {
    return this.articleService.update(article);
  }
}
