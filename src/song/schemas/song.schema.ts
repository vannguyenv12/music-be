import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import slugify from 'slugify';

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

  @Prop({ unique: true })
  slug: string;
}

export const SongSchema = SchemaFactory.createForClass(Song);

SongSchema.pre('save', async function (next) {
  if (this.title) {
    let generatedSlug = slugify(this.title, { lower: true, strict: true });

    const existingSong = await this.model('Song').findOne({
      slug: generatedSlug,
    });
    if (existingSong) {
      generatedSlug = `${generatedSlug}-${Math.floor(Math.random() * 1000)}`;
    }

    this.slug = generatedSlug;
  }
  next();
});
