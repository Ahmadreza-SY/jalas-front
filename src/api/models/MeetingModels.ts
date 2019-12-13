export class Meeting {
  constructor(
    public id: string,
    public title: string,
    public status: MeetingStatus,
    public time: TimeRange,
    public roomId: number,
    public slots: MeetingPoll[],
    public owner: string
  ) {
  }
}

export enum MeetingStatus {
  ELECTING = "ELECTING",
  PENDING = "PENDING",
  RESERVED = "RESERVED",
  CANCELED = "CANCELED"
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

export enum VoteOption {
  AGREE = "AGREE",
  DISAGREE = "DISAGREE",
  REVOKE = "REVOKE"
}