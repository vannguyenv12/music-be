import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Artist } from 'src/artist/schemas/artist.schema';
import { Song } from 'src/song/schemas/song.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profilePicture: string;

  @Prop({ default: 'MY_SYSTEM' })
  provider: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] })
  likedSongs: Song[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist' }] })
  followedArtists: Artist[];

  @Prop({ default: 'user' })
  role: 'admin' | 'user';
}

export const UserSchema = SchemaFactory.createForClass(User);
