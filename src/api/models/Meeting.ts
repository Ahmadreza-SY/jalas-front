export default class Meeting {
  constructor(
    public id: string,
    public title: string,
    public status: MeetingStatus,
    public time: TimeRange,
    public roomId: number,
    public slots: MeetingPoll[]
  ) {
  }
}

enum MeetingStatus {
  ELECTING,
  PENDING,
  RESERVED,
  CANCELED
}


export class MeetingPoll {
  constructor(
    public agreeingUsers: string[],
    public disagreeingUsers: string[],
    public time: TimeRange
  ) {
  }
}

export class TimeRange {
  constructor(
    public start: number,
    public end: number
  ) {
  }
}