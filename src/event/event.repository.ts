// 직접적인 상호작용 담당.
// query 실행 및 create, read, update, delete 기능 제공.
// db와 상호작용

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { EventData } from './type/event-data.type';
import { title } from 'process';
import { CreateEventData } from './type/create-event-data';
import { EventJoinOutPayload } from './payload/event-join-out.payload';
import { EventQuery } from './query/event-query';

@Injectable()
export class EventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(data: CreateEventData): Promise<EventData> {
    return this.prisma.event.create({
      data: {
        hostId: data.hostId,
        title: data.title,
        description: data.description,
        categoryId: data.categoryId,
        cityId: data.cityId,
        startTime: data.startTime,
        endTime: data.endTime,
        maxPeople: data.maxPeople,
        eventJoin: {
          create: {
            userId: data.hostId,
          },
        },
      },
    });
  }

  async isUserJoinedEvent(eventId: number, userId: number): Promise<boolean> {
    const event = await this.prisma.eventJoin.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    return !!event;
  }

  // 특정 event 찾기
  async findEventById(id: number): Promise<EventData> {
    const event = await this.prisma.event.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        cityId: true,
        startTime: true,
        endTime: true,
        maxPeople: true,
      },
    });

    if (!event) {
      throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
    }

    return event;
  }

  // event 참가

  async joinEvent(eventId: number, userId: number): Promise<void> {
    await this.prisma.eventJoin.create({
      data: { userId: userId, eventId: eventId },
      select: {
        userId: true,
        eventId: true,
      },
    });
  }

  async getJoinedPeople(id: number): Promise<number> {
    const joinedPeople = await this.prisma.eventJoin.count({
      where: {
        id: id,
      },
    });

    return joinedPeople;
  }

  async getEvents(query: EventQuery): Promise<EventData[]> {
    return await this.prisma.event.findMany({
      where: {
        hostId: query.hostId,
        cityId: query.cityId,
        categoryId: query.categoryId,
      },
      select: {
        id: true,
        hostId: true,
        title: true,
        description: true,
        categoryId: true,
        cityId: true,
        startTime: true,
        endTime: true,
        maxPeople: true,
      },
    });
  }

  async leaveEvent(eventId: number, userId: number): Promise<void> {
    await this.prisma.eventJoin.delete({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: userId,
        },
      },
    });
  }

  async getEndTime(eventId: number): Promise<Date> {
    const event = await this.findEventById(eventId);
    return event.endTime;
  }

  async getStartTime(eventId: number): Promise<Date> {
    const event = await this.findEventById(eventId);
    return event.startTime;
  }
}
