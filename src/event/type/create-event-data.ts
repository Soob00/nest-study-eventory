//데이터 생성 시에 내보낼 형식

export type CreateEventData = {
  id: number;
  hostId: number;
  title: string;
  description: string;
  categoryId: number;
  cityId: number;
  startTime: Date;
  endTime: Date;
  maxPeople: number;
  status: string;
  eventJoin: {
    create: {
      userId: number;
      name: string;
    };
  };
};
