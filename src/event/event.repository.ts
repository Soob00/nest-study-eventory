// 직접적인 상호작용 담당.
// query 실행 및 create, read, update, delete 기능 제공.
// db와 상호작용

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/services/prisma.service';
import { EventData } from './type/event-data.type';
import { title } from 'process';
import { CreateEventData } from './type/create-event-data';
import { CreateEventJoinPayload } from './payload/create-event-join.payload';
import { EventQuery } from './query/event-query';

@Injectable()
export class EventRepository {
  getMaxPeople: any;
  getJoinedPeople: any;
  constructor(private readonly prisma: PrismaService) {}

  async createEvent(data: CreateEventData): Promise<EventData> {
    return this.prisma.event.create({
      data: {
        id: data.id,
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
  };
  
  async isEventExist(title: string): Promise<boolean> {
    const event = await this.prisma.event.findFirst({
      where: {
        title: title,
      },
    });

    return !!event;
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
  async findEventById(id: number): Promise<void> {
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
      throw new Error(`Event with id ${id} not found`);
    }
  }

  // event 참가
  async joinEvent(userId: number, payload: CreateEventJoinPayload): Promise<EventData> {
    await this.prisma.eventJoin.create({
      data: {
        userId: userId,
        eventId: payload.eventId,
      },
    });

    return this.findEventById(payload.eventId);
  }

  async getEvents(query: EventQuery): Promise<EventData[]> {
    
  }

  async leaveEvent(userId: number, payload: CreateEventJoinPayload): Promise<void> {
    await this.prisma.eventJoin.delete({
      where: {
        eventId_userId: {
          eventId: payload.eventId,
          userId: userId,
        },
      },
    });
  }

  async getEndTime(eventId: number): Promise<Date> {
    const event = await this.findEventById(eventId);

    return event.endTime;
  }
  

    
}
