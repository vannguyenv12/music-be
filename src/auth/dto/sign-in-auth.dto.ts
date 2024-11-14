import { IsString } from 'class-validator';

export class SignInAuthDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
}
