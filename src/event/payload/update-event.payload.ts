import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDate,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// patch하면 보낼 데이터 형식

export class UpdateEventPayload {
  @IsString()
  @ApiProperty({
    description: '제목',
    type: String,
  })
  @IsOptional()
  title?: string;

  @IsString()
  @ApiProperty({
    description: '설명',
    type: String,
  })
  @IsOptional()
  description?: string;

  @IsInt()
  @ApiProperty({
    description: '카테고리 ID',
    type: Number,
  })
  @IsOptional()
  categoryId?: number;

  @IsInt()
  @ApiProperty({
    description: '도시 ID',
    type: Number,
  })
  @IsOptional()
  cityId?: number;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: '시작 시간',
    type: Date,
  })
  @IsOptional()
  startTime?: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    description: '종료 시간',
    type: Date,
  })
  @IsOptional()
  endTime?: Date;

  @IsInt()
  @ApiProperty({
    description: '최대 인원',
    type: Number,
  })
  maxPeople?: number;
}
