import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Song } from 'src/song/schemas/song.schema';
import { User } from 'src/user/schemas/user.schema';

export type CommentDocument = HydratedDocument<Comment>;

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true })
  song: Song;

  @Prop({ required: true })
  text: string;

  @Prop({ required: true })
  duration: number; // duration of audio
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
