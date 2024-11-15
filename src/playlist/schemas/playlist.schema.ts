import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import slugify from 'slugify';
import { Song } from 'src/song/schemas/song.schema';
import { User } from 'src/user/schemas/user.schema';

export type PlaylistDocument = HydratedDocument<Playlist>;

@Schema({ timestamps: true })
export class Playlist {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  creator: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }] })
  songs: Song[];

  @Prop()
  coverImage: string;

  @Prop({ default: false })
  isPublic: boolean;

  @Prop()
  slug: string;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);

PlaylistSchema.pre('save', async function (next) {
  if (this.title) {
    let generatedSlug = slugify(this.title, { lower: true, strict: true });

    const existingSong = await this.model('Playlist').findOne({
      slug: generatedSlug,
    });
    if (existingSong) {
      generatedSlug = `${generatedSlug}-${Math.floor(Math.random() * 1000)}`;
    }

    this.slug = generatedSlug;
  }
  next();
});
