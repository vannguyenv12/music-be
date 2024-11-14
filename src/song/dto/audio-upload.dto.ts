import { IsNotEmpty } from 'class-validator';

export class AudioUploadDto {
  @IsNotEmpty()
  songId: string;
}
