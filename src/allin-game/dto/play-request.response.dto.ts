import { IsString, IsNumber, IsArray, ValidateNested, IsISO8601, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { TransactionDto } from 'src/transaction/dto/transaction.dto'

export class PlayRequestResponseDto {
  @IsNumber()
  balance: number

  @IsOptional()
  @IsString()
  game_id?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TransactionDto)
  transactions?: TransactionDto[]
}
