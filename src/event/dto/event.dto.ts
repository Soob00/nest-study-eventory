import { ApiProperty } from '@nestjs/swagger';
import { EventData } from '../type/event-data.type';

// 클라이언트가 요청할 때 전송하는 것.

export class EventDto {
  @ApiProperty({
    description: '호스트 ID',
    type: Number,
  })
  hostId!: number;

  @ApiProperty({
    description: 'title',
    type: String,
  })
  title!: string;

  @ApiProperty({
    description: '모임 설명',
    type: String,
  })
  description!: string;

  @ApiProperty({
    description: '카테고리 ID',
    type: Number,
  })
  categoryId!: number;

  @ApiProperty({
    description: '도시 ID',
    type: Number,
  })
  cityId!: number;

  @ApiProperty({
    description: '시작 시간',
    type: Date,
  })
  startTime!: Date;

  @ApiProperty({
    description: '끝나는 시간',
    type: Date,
  })
  endTime!: Date;

  @ApiProperty({
    description: '최대 인원',
    type: Number,
  })
  maxPeople!: number;

  static from(event: EventData): EventDto {
    return {
      hostId: event.hostId,
      title: event.title,
      description: event.description,
      categoryId: event.categoryId,
      cityId: event.cityId,
      startTime: event.startTime,
      endTime: event.endTime,
      maxPeople: event.maxPeople,
    };
  }

  static fromArray(events: EventData[]): EventDto[] {
    return events.map((event) => this.from(event));
  }
}

// return Data가 어떻게 보이는지.
export class EventListDto {
  @ApiProperty({
    description: '이벤트 목록',
    type: [EventDto],
  })
  events!: EventDto[]; // events라는 애가 EventDto라는 배열을 가지고 있는다는 뜻

  static from(events: EventData[]): EventListDto {
    return {
      events: EventDto.fromArray(events),
    };
  }
}
