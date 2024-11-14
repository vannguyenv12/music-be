import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SongDocument = HydratedDocument<Song>;

@Schema({ timestamps: true })
export class Song {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Artist', required: true })
  artist: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Album' })
  album: Types.ObjectId;

  @Prop()
  genre: string;

  @Prop({ default: 0 })
  duration: number; // Duration in seconds

  @Prop()
  audioFile: string;

  @Prop()
  coverImage: string;

  @Prop()
  releaseDate: Date;
}

export const SongSchema = SchemaFactory.createForClass(Song);
