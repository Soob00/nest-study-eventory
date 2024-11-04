import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventListDto } from './dto/event.dto';
import { EventData } from './type/event-data.type';
import { CreateReviewPayload } from 'src/review/payload/create-review.payload';
import { EventDto } from 'src/event/dto/event.dto';
import { CreateEventPayload } from './payload/create-event.payload';
import { EventJoinOutPayload } from './payload/event-join-out.payload';
import { CreateEventData } from './type/create-event-data.type';
import { get } from 'lodash';
import { EventQuery } from './query/event-query';
import { title } from 'process';
import { string } from 'joi';

@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  // POST(create)를 위한 것.
  // 조건 - 호스트: 자동 참가, 시작시간<종료시간, 최소 1명 이상의 인원
  async createEvent(payload: CreateEventPayload): Promise<EventDto> {
    if (payload.startTime > payload.endTime) {
      throw new BadRequestException(
        '시작 시간이 종료 시간보다 늦을 수 없습니다.',
      );
    }

    if (payload.startTime < new Date()) {
      throw new BadRequestException(
        '이미 시작 시간이 지나 이벤트를 생성할 수 없습니다.',
      );
    }

    const createData: CreateEventData = {
      hostId: payload.hostId,
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      cityId: payload.cityId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      maxPeople: payload.maxPeople,
      EventJoin: payload.hostId,
    };

    const event = await this.eventRepository.createEvent(createData);

    return EventDto.from(event);
  }

  // 특정 event get 위한 것
  async findEventById(id: number): Promise<EventDto> {
    const event = await this.eventRepository.findEventById(id);

    if (!event) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }

    return EventDto.from(event);
  }

  // POST(join)을 위한 것.
  async joinEvent(eventId: number, userId: number): Promise<void> {
    const isUserJoinedEvent = await this.eventRepository.isUserJoinedEvent(
      userId,
      eventId,
    );

    const event = await this.eventRepository.findEventById(eventId);

    if (isUserJoinedEvent) {
      throw new ConflictException('이미 참가한 이벤트입니다.');
    }

    const user = await this.eventRepository.getUserById(userId);
    if (!user) {
      throw new NotFoundException('존재하지 않는 user입니다.');
    }
    
    if ( new Date() > event.startTime){

      throw new ConflictException('이미 이벤트가 시작되어 참여할 수 없습니다.');
    }

    const countjoinedPeople = await this.eventRepository.CountJoinedPeople(eventId);

    if (event.maxPeople === countjoinedPeople) {
      throw new ConflictException('모임인원이 가득 차서 참여할 수 없습니다.');
    }

    await this.eventRepository.joinEvent(eventId, userId);
  }

  // 특정 모임 GET을 위한 것.(여러 개)
  async getEvents(query: EventQuery): Promise<EventListDto> {
    const events = await this.eventRepository.getEvents(query);
    return EventListDto.from(events);
  }

  // post(out)을 위한 것.
  async leaveEvent(eventId: number, userId: number): Promise<void> {
    const isUserJoinedEvent = await this.eventRepository.isUserJoinedEvent(
      userId,
      eventId,
    );

    const event = await this.eventRepository.findEventById(eventId);

    if (userId == event.hostId) {
      throw new ConflictException('이벤트의 호스트는 탈퇴할 수 없습니다.');
    }

    if (!isUserJoinedEvent) {
      throw new ConflictException('이벤트에 참가하지 않았습니다.');
    }

    if (new Date() > event.startTime) {
      throw new ConflictException('이벤트가 시작되어 탈퇴할 수 없습니다.');
    }

    await this.eventRepository.leaveEvent(eventId, userId);
  }
}
