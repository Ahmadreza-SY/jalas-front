export class Meeting {
  constructor(
    public id: string,
    public title: string,
    public status: MeetingStatus,
    public time: TimeRange,
    public roomId: number,
    public slots: MeetingPoll[],
    public guests: string[],
    public owner: string,
    public comments: CommentModel[]
  ) {
  }
}

export enum MeetingStatus {
  ELECTING = "ELECTING",
  PENDING = "PENDING",
  RESERVED = "RESERVED",
  CANCELED = "CANCELED",
  CLOSED = "CLOSED"
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

export class CommentModel {
  constructor(
    public id: string | undefined,
    public owner: string | undefined,
    public content: string,
    public creationDate: number,
    public replies: CommentModel[],
    public meetingId: string
  ) {
  }
}

export type StateToCssClassMap = Record<string, string>;
export let StateClassMap: StateToCssClassMap = {
  "ELECTING": "dark",
  "PENDING": "secondary",
  "RESERVED": "success",
  "CANCELED": "danger",
  "CLOSED": "warning"
};