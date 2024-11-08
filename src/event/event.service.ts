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
import { PatchEventPayload } from './payload/patch-event.payload';
import { UpdateEventData } from './type/update-event-data.type';
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

    if (new Date() > event.startTime) {
      throw new ConflictException('이미 이벤트가 시작되어 참여할 수 없습니다.');
    }

    const NumOfJoinedPeople =
      await this.eventRepository.CountJoinedPeople(eventId);

    if (event.maxPeople === NumOfJoinedPeople) {
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
    const UserJoinedEvent = await this.eventRepository.isUserJoinedEvent(
      userId,
      eventId,
    );

    const event = await this.eventRepository.findEventById(eventId);

    if (userId == event.hostId) {
      throw new ConflictException('이벤트의 호스트는 탈퇴할 수 없습니다.');
    }

    if (!UserJoinedEvent) {
      throw new ConflictException('이벤트에 참가하지 않았습니다.');
    }

    if (new Date() > event.startTime) {
      throw new ConflictException('이벤트가 시작되어 탈퇴할 수 없습니다.');
    }

    await this.eventRepository.leaveEvent(eventId, userId);
  }

  async patchupdateEvent(
    eventId: number,
    payload: PatchEventPayload,
  ): Promise<EventDto> {
    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }

    // payload를 통해 들어온 값들이 null인지 확인
    if (payload.title === null) {
      throw new BadRequestException('제목을 입력해주세요.');
    }

    if (payload.categoryId === null) {
      throw new BadRequestException('카테고리를 입력해주세요.');
    }

    if (payload.description === null) {
      throw new BadRequestException('설명을 입력해주세요.');
    }

    if (payload.cityId === null) {
      throw new BadRequestException('도시를 입력해주세요.');
    }

    if (payload.startTime === null) {
      throw new BadRequestException('시작 시간을 입력해주세요.');
    }

    if (payload.endTime === null) {
      throw new BadRequestException('종료 시간을 입력해주세요.');
    }

    if (payload.maxPeople === null) {
      throw new BadRequestException('최대인원을 입력해주세요.');
    }

    // 기타 정보 확인
    // 시작시간이 종료시간보다 늦을 수 없음. 최대인원 관련, 시작시간 지났는지

    // 1. 시간 관련
    // 시작시간은 종료시간보다 늦을 수 없음(null 아닌 경우만)
    if (
      payload.startTime &&
      payload.endTime &&
      payload.startTime > payload.endTime
    ) {
      throw new BadRequestException(
        '시작 시간이 종료 시간보다 늦을 수 없습니다.',
      );
    }

    // 수정한 이벤트 시작시간이 현재 시간 전이면 모임 정보 수정 불가
    if (payload.startTime && new Date() > payload.startTime) {
      throw new BadRequestException(
        '현재 시간보다 시작 시간이 늦어 이벤트를 수정할 수 없습니다.',
      );
    }

    // 이벤트 시작했으면 수정 불가
    if (new Date() > event.startTime) {
      throw new ConflictException('이벤트가 이미 시작되어 수정할 수 없습니다.');
    }

    // payload로 시작시간만 받는 경우 - 종료시간이 원래 시작시간보다 늦어야함
    if (
      payload.startTime &&
      !payload.endTime &&
      payload.startTime > event.endTime
    ) {
      throw new ConflictException('종료 시간이 시작시간보다 빠를 수 없습니다.');
    }

    // payload로 종료시간만 받는 경우 - 시작시간이 원래 종료시간보다 빨라야함
    if (
      !payload.startTime &&
      payload.endTime &&
      payload.endTime < event.startTime
    ) {
      throw new ConflictException('시작 시간을 종료시간보다 늦을 수 없습니다.');
    }

    ///

    // 2. 최대인원 관련
    const NumOfJoinedPeople =
      await this.eventRepository.CountJoinedPeople(eventId);

    if (payload.maxPeople && payload.maxPeople < NumOfJoinedPeople) {
      throw new ConflictException('참가자 수가 최대인원보다 많습니다.');
    }

    const patchupdateData: UpdateEventData = {
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      cityId: payload.cityId,
      startTime: payload.startTime,
      endTime: payload.endTime,
      maxPeople: payload.maxPeople,
    };

    const patchupdatedEvent = await this.eventRepository.patchupdateEvent(
      eventId,
      patchupdateData,
    );

    return EventDto.from(patchupdatedEvent);
  }

  async deleteEvent(eventId: number): Promise<void> {
    const event = await this.eventRepository.findEventById(eventId);

    if (!event) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }

    if (new Date() > event.startTime) {
      throw new ConflictException('이벤트가 시작되어 삭제할 수 없습니다.');
    }

    await this.eventRepository.deleteEvent(eventId);
  }
}
