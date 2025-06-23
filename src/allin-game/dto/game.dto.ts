import {
  IsNumber,
  IsString,
  IsBoolean,
  IsArray,
  ArrayNotEmpty,
  IsObject,
} from 'class-validator';

export class GameDto {
  @IsNumber()
  id: number;

  @IsString()
  producer: string;

  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsString()
  theme: string;

  @IsBoolean()
  has_freespins: boolean;

  @IsString()
  feature_group: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  devices: string[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  licenses: string[];

  @IsString()
  jackpot_type: string;

  @IsBoolean()
  forbid_bonus_play: boolean;

  @IsNumber()
  lines: number;

  @IsNumber()
  payout: number;

  @IsString()
  volatility_rating: string;

  @IsBoolean()
  has_jackpot: boolean;

  @IsBoolean()
  hd: boolean;

  @IsObject()
  restrictions: Record<string, unknown>;

  @IsBoolean()
  has_live: boolean;
}
