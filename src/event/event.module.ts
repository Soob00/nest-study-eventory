// 특정 도메인과 관련된 것들 그룹화함.
// controller, service, repository 묶어서 관리.

import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';

@Module({
  // 여기에 있어야 실행 가능.
  controllers: [EventController],
  providers: [EventService, EventRepository],
})
export class EventModule {}
