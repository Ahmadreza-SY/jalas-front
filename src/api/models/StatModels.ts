export class GeneralReport {
  constructor(
    public reservationTimeAvg: number,
    public reservedRoomsCount: number,
    public canceledMeetingsCount: number
  ) {
  }
}