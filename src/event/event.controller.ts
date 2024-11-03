// controller: 클라이언트 요청 처리, 해당 요청 service로 보냄
// 주로 경로와 HTTP 메서드 정의
// 생성, 조회, 삭제 등등의 API

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { EventDto, EventListDto } from './dto/event.dto';
import { CreateReviewPayload } from 'src/review/payload/create-review.payload';
import { CreateEventPayload } from './payload/create-event.payload';
import { CreateEventJoinPayload } from './payload/create-event-join.payload';
import { EventQuery } from './query/event-query';
import { EventData } from './type/event-data.type';

@Controller('events')
@ApiTags('Event API')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // 이벤트 생성
  @Post()
  @ApiOperation({ summary: '이벤트를 생성합니다.' })
  @ApiOkResponse({ type: EventDto })
  async createEvent(@Body() payload: CreateEventPayload): Promise<EventDto> {
    return this.eventService.createEvent(payload);
  }

  // 모임 한 개를 조회
  @Get(':id')
  @ApiOperation({ summary: '하나의 모임 조회' })
  @ApiOkResponse({ type: EventDto })
  async findEventById(@Param('id') id: number): Promise<EventDto> {
    return this.eventService.findEventById(id);
  }

  // 특정 여러 개의 모임 조회
  @Get()
  @ApiOperation({ summary: '여러 모임 정보를 가져옵니다' })
  @ApiOkResponse({ type: EventListDto })
  async getReviews(@Query() query: EventQuery): Promise<EventListDto> {
    return this.eventService.getEvents(query);
  }

  // 유저가 모임에 참가하는 API
  @Post(':eventid/join')
  @ApiOperation({ summary: '이벤트 참가' })
  @ApiNoContentResponse()
  async joinEvent(
    @Param('eventId') eventId: number,
    @Body() payload: CreateEventJoinPayload,
  ): Promise<void> {
    const userId = payload.userId;
    return this.eventService.joinEvent(eventId, userId);
  }

  // 유저가 모임에서 나가는 API
  @Post(':eventid/out')
  @ApiOperation({ summary: '이벤트 나가기' })
  @ApiNoContentResponse()
  async leaveEvent(
    @Param('eventId') eventId: number,
    @Body() payload: CreateEventJoinPayload,
  ): Promise<void> {
    const userId = payload.userId;
    const endTime = new Date(); // or assign the appropriate value
    return this.eventService.leaveEvent(eventId, userId);
  }

  @Get(':eventId/endTime')
  @ApiOperation({ summary: '이벤트 종료 시간' })
  @ApiOkResponse({ type: Date })
  async getEndTime(@Param('eventId') eventId: number): Promise<Date> {
    return this.eventService.getEndTime(eventId);
  }
}
