import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

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

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Playlist' }] })
  playlists: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Song' }] })
  favorites: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Artist' }] })
  followedArtists: Types.ObjectId[];

  @Prop({ default: 'user' })
  role: 'admin' | 'user';
}

export const UserSchema = SchemaFactory.createForClass(User);
