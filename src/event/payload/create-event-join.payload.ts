import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// post하면 보낼 데이터 형식
export class CreateEventJoinPayload {
    
    @IsInt()
    @ApiProperty({
    description: '이벤트 ID',
    type: Number,
    })
    eventId!: number;
    
    @IsInt()
    @ApiProperty({
    description: '참가자 ID',
    type: Number,
    })
    userId!: number;
    
}
