export class User {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public notificationTypes: NotificationType[],
    public isAdmin: boolean
  ) {
  }
}

export class LoginResponse {
  constructor(
    public token: string,
    public type: string
  ) {
  }
}

export enum NotificationType {
  MEETING_INVITATION = "MEETING_INVITATION",
  MEETING_VOTE = "MEETING_VOTE",
  MEETING_REMOVE_GUEST = "MEETING_REMOVE_GUEST",
  MEETING_RESERVATION = "MEETING_RESERVATION"
}

export type StateToCssClassMap = Record<string, string>;
export let StateClassMap: StateToCssClassMap = {
  "ELECTING": "dark",
  "PENDING": "secondary",
  "RESERVED": "success",
  "CANCELED": "danger",
  "CLOSED": "warning"
};