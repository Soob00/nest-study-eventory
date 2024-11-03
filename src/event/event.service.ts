import { 
  Injectable,
  ConflictException,
  NotFoundException,
 } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { EventListDto } from './dto/event.dto';
import { EventData } from './type/event-data.type';
import { CreateReviewPayload } from 'src/review/payload/create-review.payload';
import { EventDto } from 'src/event/dto/event.dto';
import { CreateEventPayload } from './payload/create-event.payload';
import { CreateEventJoinPayload } from './payload/create-event-join.payload';
import { CreateEventData } from './type/create-event-data';
import { get } from 'lodash';
import { EventQuery } from './query/event-query';
import { title } from 'process';

@Injectable()
export class EventService {
  getEndTime(eventId: number): Date | PromiseLike<Date> {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly eventRepository: EventRepository) {}

  // POST(create)를 위한 것.
  // 조건 - 호스트: 자동 참가, 시작시간<종료시간, 최소 1명 이상의 인원, 중복된 이벤트 제목 불가, 시작전,진행중,종료의 상태만 가짐.
  async createEvent(payload: CreateEventPayload): Promise<EventDto> {
    const isEventExist = await this.eventRepository.isEventExist(
      payload.title,
    );

    if (isEventExist) {
      throw new ConflictException('이미 존재하는 이벤트입니다.');
    }

    if (payload.startTime > payload.endTime) {
      throw new ConflictException('시작 시간이 종료 시간보다 늦을 수 없습니다.');
    }

    if (payload.maxPeople < 1) {
      throw new ConflictException('최소 1명 이상의 인원이 필요합니다.');
    }

    const createData: CreateEventData = {
      id: generateUniqueId(),
      hostId: payload.hostId,
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      cityId: payload.cityId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      maxPeople: payload.maxPeople,
      status: '',
      eventJoin: {
        create: {
          userId: payload.hostId,
          name: ''
        }
      }
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

    if (isUserJoinedEvent) {
      throw new ConflictException('이미 참가한 이벤트입니다.');
    }

    const endTime = await this.eventRepository.getEndTime(eventId);

    if (endTime < new Date()) {
      throw new ConflictException('이벤트가 종료되었습니다.');
    }

    const startTime = await this.eventRepository.getStartTime(eventId);
    
    if ( new Date() > startTime){
      throw new ConflictException('이벤트가 시작되었습니다.');
    }

    const event = await this.eventRepository.findEventById(eventId);
    const maxPeople = await this.eventRepository.getMaxPeople(eventId);
    const joinedPeople = await this.eventRepository.getJoinedPeople(eventId);

    if (maxPeople <= joinedPeople) {
      throw new ConflictException('인원이 가득 찼습니다.');
    }
    
    const joinPayload: CreateEventJoinPayload = { eventId, userId };
    await this.eventRepository.joinEvent(userId, joinPayload);
  }

  async getEvents(query: EventQuery): Promise<EventListDto> {
    const events = await this.eventRepository.getEvents(query);

    return EventListDto.from(events);
  }

  async leaveEvent(eventId: number, userId: number): Promise<void> {
    const isUserJoinedEvent = await this.eventRepository.isUserJoinedEvent(
      userId,
      eventId,
    );

    if (!isUserJoinedEvent) {
      throw new ConflictException('이벤트에 참가하지 않았습니다.');
    }

    const endTime = await this.eventRepository.getEndTime(eventId);

    if (endTime < new Date()) {
      throw new ConflictException('이벤트가 종료되었습니다.');
    }


    const leavePayload: CreateEventJoinPayload = { eventId, userId };
    await this.eventRepository.leaveEvent(userId, leavePayload);
  }
  
}


function generateUniqueId(): number {
  throw new Error('Function not implemented.');
}

// 끝. 제일 간단하게. sudo code 느낌으로.

