import axios, {AxiosPromise} from 'axios';
import {CommentModel, Meeting, TimeRange, VoteOption} from './models/MeetingModels';
import AvailableRoomsResponse from './models/AvailableRoomsResponse';
import {LoginResponse, User} from "./models/UserModels";
import ToastUtils from "../utils/ToastUtils";
import {GeneralReport} from "./models/StatModels";

class ApiClass {
  private axiosInstance = axios.create({
    baseURL: 'http://localhost:8080'
  });

  constructor() {
    this.axiosInstance.interceptors.request.use(config => {
        if (config.url && (config.url.includes("/login")))
          return config;
        config.headers["Authorization"] = localStorage.getItem("token");
        return config
      },
      error => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      response => response,
      error => {
        if (error.response.status === 401) {
          localStorage.clear();
          window.location.pathname = "/login";
        }
        ToastUtils.error(error.response.data.message);
        return Promise.reject(error)
      }
    )
  };

  getMeetings() {
    return this.axiosInstance.get<Meeting[]>(`/meeting`);
  }

  getPolls() {
    return this.axiosInstance.get<Meeting[]>(`/meeting/poll`)
  }

  getMeeting(id: string) {
    return this.axiosInstance.get<Meeting>(`/meeting/${id}`);
  }

  updateMeeting(id: string, newSlot: TimeRange) {
    return this.axiosInstance.put(`/meeting/${id}`, {newSlots: [newSlot]})
  }

  addMeetingGuest(id: string, guestEmail: string) {
    return this.axiosInstance.post(`/meeting/${id}/guest`, {guest: guestEmail})
  }

  deleteMeetingGuest(id: string, guestEmail: string) {
    return this.axiosInstance.delete(`/meeting/${id}/guest`, {
      headers: {
        Authorization: localStorage.getItem("token")
      },
      data: {
        guest: guestEmail
      }
    })
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

  addCommentForMeeting(meetingId: string, content: string): AxiosPromise<CommentModel> {
    return this.axiosInstance.post(`/meeting/${meetingId}/comment`, {content})
  }

  updateCommentForMeeting(meetingId: string, comment: CommentModel): AxiosPromise<CommentModel> {
    return this.axiosInstance.put(`/meeting/${meetingId}/comment`, comment)
  }

  login(username: string, password: string): AxiosPromise<LoginResponse> {
    return this.axiosInstance.post(`/auth/login`, {username, password})
  }

  profile(): AxiosPromise<User> {
    return this.axiosInstance.get(`/auth/profile`)
  }

  report(): AxiosPromise<GeneralReport> {
    return this.axiosInstance.get(`/report`)
  }

  deleteComment(commentId: string) {
    return this.axiosInstance.delete(`/meeting/comment/${commentId}`)
  }
}

const Api = new ApiClass();
export default Api;