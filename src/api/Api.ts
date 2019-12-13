import axios from 'axios';
import Meeting, {TimeRange, VoteOption} from './models/MeetingModels';
import AvailableRoomsResponse from './models/AvailableRoomsResponse';

class ApiClass {
  private axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
  });

  getMeeting(id: string) {
    return this.axiosInstance.get<Meeting>(`/meeting/${id}`);
  }

  getAvailableRooms(start: number, end: number) {
    return this.axiosInstance.get<AvailableRoomsResponse>('/meeting/available-rooms', {
      params: {
        'start': start,
        'end': end
      }
    })
  }

  reserveRoom(meetingId: string, selectedRoom: number, selectedTime: TimeRange, pageEntryTime: Date) {
    return this.axiosInstance.post(`/meeting/${meetingId}/reserve`, {
      selectedRoom,
      selectedTime,
      pageEntryTime
    })
  }

  cancelReservation(meetingId: string) {
    return this.axiosInstance.delete(`/meeting/${meetingId}/reserve`)
  }

  createMeeting(title: string, slots: TimeRange[], guests: string[]) {
    return this.axiosInstance.post('/meeting', {
      title, slots, guests
    })
  }

  voteForMeeting(meetingId: string, email: string, slot: TimeRange, vote: VoteOption) {
    return this.axiosInstance.put(`/meeting/${meetingId}/vote`, {
      email, slot, vote
    })
  }
}

const Api = new ApiClass();
export default Api;