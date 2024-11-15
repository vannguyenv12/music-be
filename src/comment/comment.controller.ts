// comment.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/_core/decorators/current-user.decorator';
import { AuthGuard } from 'src/_core/guards/auth.guard';
import { TransformDTO } from 'src/_core/interceptors/transform-dto.interceptor';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ResponseCommentDto } from './dto/response-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
@TransformDTO(ResponseCommentDto)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user,
  ) {
    return this.commentService.create(createCommentDto, user);
  }

  @Get('song/:songId')
  async findAllBySong(@Param('songId') songId: string) {
    return this.commentService.findAllBySong(songId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
