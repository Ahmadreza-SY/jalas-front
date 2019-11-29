import axios from 'axios';
import Meeting from './models/Meeting';
import AvailableRoomsResponse from './models/AvailableRoomsResponse';

class ApiClass {
  private axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
  });

  getMeeting(id: string) {
    return this.axiosInstance.get<Meeting>('/meeting/5de101629cde7661f67be93b');
  }

  getAvailableRooms(start: number, end: number) {
    return this.axiosInstance.get<AvailableRoomsResponse>('/meeting/available-rooms', {
      params: {
        'start': start,
        'end': end
      }
    })
  }
}

const Api = new ApiClass();
export default Api;