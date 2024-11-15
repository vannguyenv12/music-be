import { Expose, Transform } from 'class-transformer';
import { ExposeId } from 'src/_core/decorators/expose-id.decorator';

export class ResponseCommentDto {
  @ExposeId()
  _id: string;
  @Expose()
  song: string;
  @Expose()
  text: string;
  @Expose()
  duration: number;
  @Expose()
  createdAt: string;
  @Expose()
  updatedAt: string;
  @Expose()
  @Transform(({ obj }) => obj?.user?._id)
  commentById: string;
  @Expose()
  @Transform(({ obj }) => obj?.user?.username)
  commentByUsername: string;
  @Expose()
  @Transform(({ obj }) => obj?.user?.name)
  commentByName: string;
}
