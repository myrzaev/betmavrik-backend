import {
  IsString,
  IsNumber,
  IsIn,
  ValidateNested,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator'
import { Type } from 'class-transformer'

export class PlayActionDto {
  @IsString()
  action: string

  @IsString()
  action_id: string

  @IsNumber()
  amount: number
}

export class PlayRequestDto {
  @IsString()
  user_id: string

  @IsIn(['EUR', 'USD'])
  currency: string

  @IsOptional()
  @IsString()
  game?: string

  @IsOptional()
  @IsString()
  game_id?: string

  @IsOptional()
  @IsBoolean()
  finished?: boolean

  @IsOptional()
  @IsString()
  game_item_id?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayActionDto)
  actions?: PlayActionDto[]
}
