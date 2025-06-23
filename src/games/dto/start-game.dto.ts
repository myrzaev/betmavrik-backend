import { IsString, IsNumber, IsIn, IsIP, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UrlsDto {
  @IsString() deposit_url: string;
  @IsString() return_url: string;
}

export class UserDto {
  @IsString() user_id: string;
  @IsString() firstname: string;
  @IsString() lastname: string;
  @IsString() nickname: string;
  @IsString() city: string;
  @IsDateString() date_of_birth: string;
  @IsDateString() registred_at: string;
  @IsIn(['m', 'f']) gender: string;
  @IsString() country: string;
}

export class StartGameDto {
  @IsNumber() game_id: number;
  @IsIn(['EUR', 'USD']) currency: string;
  @IsString() locale: string;
  @IsIP() ip: string;
  @IsIn(['mobile', 'desktop']) client_type: string;

  @ValidateNested()
  @Type(() => UrlsDto)
  url: UrlsDto;

  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsNumber() rtp: number;
}