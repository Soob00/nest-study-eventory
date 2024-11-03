import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

// post하면 보낼 데이터 형식
export class CreateEventPayload {
  @IsInt()
  @ApiProperty({
    description: '호스트 ID',
    type: Number,
  })
  hostId!: number;

  @IsString()
  @ApiProperty({
    description: '제목',
    type: String,
  })
  title!: string;

  @IsString()
  @ApiProperty({
    description: '설명',
    type: String,
  })
  description!: string;

  @IsInt()
  @ApiProperty({
    description: '카테 고리 ID',
    type: Number,
  })
  categoryId!: number;

  @IsInt()
  @ApiProperty({
    description: '도시 ID',
    type: Number,
  })
  cityId!: number;

  @IsDate()
  @ApiProperty({
    description: '시작 시간',
    type: Date,
  })
  startTime!: Date;

  @IsDate()
  @ApiProperty({
    description: '마감 시간',
    type: Date,
  })
  endTime!: Date;

  @IsInt()
  @ApiProperty({
    description: '최대인원',
    type: Number,
  })
  maxPeople!: number;
}