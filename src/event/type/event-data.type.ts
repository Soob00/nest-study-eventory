// 전체 data type 구조 정의

export type EventData = {
  score: number;
  userId: number;
  eventId: number;
  hostName: string;
  status: number;
  id: number;
  hostId: number;
  title: string;
  description: string;
  categoryId: number;
  cityId: number;
  startTime: Date;
  endTime: Date;
  maxPeople: number;
};
