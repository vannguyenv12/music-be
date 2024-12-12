// comment.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  // Create a new comment
  async create(createCommentDto: CreateCommentDto, user): Promise<Comment> {
    const comment = new this.commentModel({
      ...createCommentDto,
      user: user._id,
    });
    return comment.save();
  }

  // Get all comments for a specific song
  async findAllBySong(songId: string): Promise<Comment[]> {
    return this.commentModel
      .find({ song: songId })
      .sort({ createdAt: -1 })
      .populate('user')
      .exec();
  }

  // Get a specific comment by its ID
  async findOne(id: string) {
    const comment = await this.commentModel
      .findById(id)
      .populate('user')
      .exec();
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }

  // Update a comment
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.findOne(id);
    comment.text = updateCommentDto.text;
    return comment.save();
  }

  async remove(id: string) {
    const comment = await this.commentModel.findByIdAndDelete(id);
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
  }
}
