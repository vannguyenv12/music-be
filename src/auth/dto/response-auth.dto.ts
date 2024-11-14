import { Expose } from 'class-transformer';

export class ResponseAuthDto {
  @Expose()
  accessToken: string;
}
