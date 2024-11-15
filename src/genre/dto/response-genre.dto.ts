import { Expose } from 'class-transformer';
import { ExposeId } from 'src/_core/decorators/expose-id.decorator';

export class ResponseGenreDto {
  @ExposeId()
  _id: string;
  @Expose()
  name: string;
  @Expose()
  description?: string;
}
