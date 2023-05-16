import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

import { CommentDto, UserDto, createCommentDto } from 'src/dto';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() comment: createCommentDto): Promise<CommentDto> {
    return this.commentService.create(comment);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  delete(
    @Body() comment: CommentDto,
    @Req() req: Request
  ): Promise<CommentDto> {
    const { _id } = req.user as UserDto;
    return this.commentService.delete(comment, _id);
  }
}
