import { IsString } from 'class-validator';

export class UserCreationDto {
  @IsString()
  name: string;
}