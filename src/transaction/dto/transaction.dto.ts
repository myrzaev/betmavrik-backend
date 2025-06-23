import { IsString, IsISO8601 } from 'class-validator';

export class TransactionDto {
  @IsString()
  action_id: string;

  @IsString()
  action: string;

  @IsString()
  amount: number;

  @IsISO8601()
  processed_at: string;
}