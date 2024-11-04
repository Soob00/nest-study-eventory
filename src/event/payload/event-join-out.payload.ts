import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// post하면 보낼 데이터 형식
// controller에서 사용
export class EventJoinOutPayload {
  @IsInt()
  @ApiProperty({
    description: '참가자 ID',
    type: Number,
  })
  userId!: number;
}
