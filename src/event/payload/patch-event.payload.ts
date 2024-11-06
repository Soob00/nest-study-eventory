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

export class PatchEventPayload {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '제목',
    type: String,
  })
  title?: string | null;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: '설명',
    type: String,
  })
  description?: string | null;

  @IsOptional()
  @IsInt()
  @ApiPropertyOptional({
    description: '카테고리 ID',
    type: Number,
  })
  categoryId?: number | null;

  @IsOptional()
  @IsInt()
  @ApiProperty({
    description: '도시 ID',
    type: Number,
  })
  cityId?: number | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({
    description: '시작 시간',
    type: Date,
  })
  startTime?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiPropertyOptional({
    description: '마감 시간',
    type: Date,
  })
  endTime?: Date;

  @IsOptional()
  @IsPositive()
  @IsInt()
  @ApiPropertyOptional({
    description: '최대인원',
    type: Number,
  })
  maxPeople?: number | null;
}
