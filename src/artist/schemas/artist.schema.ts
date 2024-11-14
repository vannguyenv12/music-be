import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ArtistDocument = HydratedDocument<Artist>;

@Schema({ timestamps: true })
export class Artist {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  bio: string;

  @Prop()
  profilePicture: string;

  @Prop([String])
  genres: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Album' }] })
  albums: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Song' }] })
  songs: Types.ObjectId[];
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);
