import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Artist } from 'src/artist/schemas/artist.schema';
import { Song } from 'src/song/schemas/song.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema({ timestamps: true })
export class Album {
  @Prop({ required: true })
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true })
  artist: Artist;

  @Prop()
  coverImage: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] })
  songs: Song[];

  @Prop()
  releaseDate: Date;
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
