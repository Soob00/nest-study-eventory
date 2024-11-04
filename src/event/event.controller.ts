// controller: 클라이언트 요청 처리, 해당 요청 service로 보냄
// 주로 경로와 HTTP 메서드 정의
// 생성, 조회, 삭제 등등의 API

import { Body, Controller, Get, HttpCode, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { EventService } from './event.service';
import { EventDto, EventListDto } from './dto/event.dto';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventJoinOutPayload } from './payload/event-join-out.payload';
import { EventQuery } from './query/event-query';
import { EventData } from './type/event-data.type';

@Controller('events')
@ApiTags('Event API')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // 이벤트 생성
  @Post()
  @ApiCreatedResponse()
  @ApiOperation({ summary: '이벤트를 생성합니다.' })
  @ApiOkResponse({ type: EventDto })
  async createEvent(
    @Param('eventId') eventId: number,
    @Body() payload: CreateEventPayload,
  ): Promise<EventDto> {
    return this.eventService.createEvent(payload);
  }

  // 모임 한 개를 조회
  @Get(':id')
  @ApiOperation({ summary: '하나의 모임을 조회합니다.' })
  @ApiOkResponse({ type: EventDto })
  async findEventById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EventDto> {
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
  @ApiOperation({ summary: '유저가 모임에 참가합니다.' })
  @HttpCode(204)
  @ApiNoContentResponse()
  async joinEvent(
    @Param('eventId') eventId: number,
    @Body() payload: EventJoinOutPayload,
  ): Promise<void> {
    return this.eventService.joinEvent(eventId, payload.userId);
  }

  // 유저가 모임에서 나가는 API
  @Post(':eventid/out')
  @ApiOperation({ summary: '유저가 모임에 탈퇴합니다.' })
  @ApiNoContentResponse()
  async leaveEvent(
    @Param('eventId') eventId: number,
    @Body() payload: EventJoinOutPayload,
  ): Promise<void> {
    return this.eventService.leaveEvent(eventId, payload.userId);
  }
}
