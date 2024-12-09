import { IsString } from 'class-validator';

export class CreateAuthSocial {
  @IsString()
  username: string;
  @IsString()
  name: string;
  @IsString()
  provider: string;
}
