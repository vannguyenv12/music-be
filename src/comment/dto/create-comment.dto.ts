import {
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCommentDto {
  @IsMongoId()
  @IsNotEmpty()
  song: string;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsInt()
  duration: number;
}
