import React, {ChangeEvent, Component, FormEvent} from 'react';
import Api from '../../api/Api';
import {
  CommentModel,
  Meeting,
  MeetingPoll,
  MeetingStatus,
  StateClassMap,
  TimeRange
} from '../../api/models/MeetingModels';
import ReservableTimeSlotComponent from '../timeSlot/ReservableTimeSlot';
import ReservedTimeSlot from '../timeSlot/ReservedTimeSlot';
import {RouteComponentProps} from 'react-router';
import CommentItem from './CommentItem';
import ToastUtils from "../../utils/ToastUtils";
import {User} from '../../api/models/UserModels';
import {Redirect} from "react-router-dom";


export default class MeetingComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      meeting: undefined,
      selectedTimeSlot: undefined,
      pageEntryTime: new Date(),
      commentContent: "",
      newSlotStart: 0,
      newSlotEnd: 0,
      user: undefined,
      guestEmail: "",
      redirectLink: undefined
    };
  }

  componentDidMount(): void {
    this.getMeeting();
    Api.profile().then(response => {
      let redirectLink = undefined;
      if (response.data.isAdmin)
        redirectLink = `/report`;
      this.setState({user: response.data, redirectLink})
    })
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.location.pathname === "/meeting/new")
      this.getMeeting()
  }

  getMeeting() {
    Api.getMeeting(this.props.match.params.meetingId).then(response => {
      const meeting = response.data;
      const user = this.getUser()
      if (!(meeting.guests.includes(user.email)) && (this.getUser().email !== meeting.owner)) {
        this.setState({redirectLink: "/meeting"});
      } else
        this.setState({...this.state, meeting: response.data});
    })
  }

  selectTimeSlot(index: number) {
    this.setState({...this.state, selectedTimeSlot: index})
  }

  clearSelectedTimeSlot() {
    this.setState({...this.state, selectedTimeSlot: undefined})
  }

  cancelReservation() {
    Api.cancelReservation(this.props.match.params.meetingId).then(response => {
      const meeting = this.state.meeting;
      if (meeting) {
        meeting.status = MeetingStatus.CANCELED;
        this.setState({...this.state, meeting})
      }
    })
  }

  closePoll() {
    Api.closePoll(this.props.match.params.meetingId).then(response => {
      const meeting = this.state.meeting;
      if (meeting) {
        meeting.status = MeetingStatus.CLOSED;
        this.setState({...this.state, meeting})
      }
    })
  }

  isOwner() {
    const user = this.getUser();
    return this.state.meeting!!.owner === user.email
  }

  getUser(): User {
    return JSON.parse(localStorage.getItem("user")!!);
  }

  updateStart(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value)
      return;
    const date = new Date(e.target.value);
    this.setState({...this.state, newSlotStart: date.getTime()})
  }

  updateEnd(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value)
      return;
    const date = new Date(e.target.value);
    this.setState({...this.state, newSlotEnd: date.getTime()})
  }

  updateMeeting() {
    if (this.state.newSlotStart == 0 || this.state.newSlotEnd == 0) {
      ToastUtils.error("No slot entered!");
      return
    }
    Api.updateMeetingSlots(
      this.props.match.params.meetingId,
      new TimeRange(this.state.newSlotStart, this.state.newSlotEnd)
    )
      .then(response => {
        let meeting = response.data;
        this.setState({meeting});
        ToastUtils.success("New slot added successfully");
      })
  }

  deleteMeetingSlot(slot: TimeRange) {
    Api.deleteMeetingSlot(this.props.match.params.meetingId, slot).then(response => {
      let meeting = response.data;
      this.setState({meeting});
    })
  }

  updateGuestEmail(e: ChangeEvent<HTMLInputElement>) {
    this.setState({...this.state, guestEmail: e.target.value})
  }

  private deleteGuest(guest: string) {
    let meeting = this.state.meeting!!;
    Api.deleteMeetingGuest(meeting.id, guest)
      .then(response => {
        meeting.guests = meeting.guests.filter(item => item !== guest);
        this.setState({meeting});
        ToastUtils.success("Guest removed successfully");
      })
  }

  private addGuest() {
    let meeting = this.state.meeting!!;
    Api.addMeetingGuest(meeting.id, this.state.guestEmail)
      .then(response => {
        meeting.guests.push(this.state.guestEmail);
        this.setState({meeting, guestEmail: ""});
        ToastUtils.success("Guest invited successfully");
      })
  }

  render() {
    let meeting = this.state.meeting;
    let additionalOptionForm = (
      <div className="card text-white bg-dark mt-2">
        <div className="card-header">ثبت زمان جدید</div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">شروع</label>
              <input className="form-control" onChange={e => this.updateStart(e)} type="datetime-local"/>
            </div>
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">پایان</label>
              <input className="form-control" onChange={e => this.updateEnd(e)} type="datetime-local"/>
            </div>
          </div>
          <button className="btn btn-success" onClick={() => this.updateMeeting()}>
            ثبت زمان جدید
          </button>
        </div>
      </div>
    );
    let additionalGuestForm = (
      <div className="card text-white bg-dark mt-2">
        <div className="card-header">مهمان‌ها</div>
        <div className="card-body">
          <div className="row mb-3">
            {this.state.meeting && this.state.meeting.guests.map((guest: string, index: number) => (
                <div className="col-auto mb-2" key={index}>
                  <span className="mr-1">{guest}</span>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => this.deleteGuest(guest)}>
                    <i className="fas fa-trash"/>
                  </button>
                </div>
              )
            )}
          </div>
          <div className="row">
            <div className="col">
              <input className="form-control" onChange={(e) => this.updateGuestEmail(e)}
                     type="email" placeholder="ایمیل مهمان" value={this.state.guestEmail}/>
            </div>
            <div className="col">
              <button className="btn btn-primary" onClick={() => this.addGuest()}>دعوت از مهمان</button>
            </div>
          </div>
        </div>
      </div>
    );
    if (this.state.redirectLink !== undefined)
      return <Redirect to={this.state.redirectLink}/>;
    if (!meeting)
      return <div className="spinner-border"/>;
    return <div>
      <div className="card text-white bg-dark">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col">
              <h1 className="mb-0">
                {meeting.title}
                <span className={`badge badge-${StateClassMap[meeting.status]} ml-3`}>{meeting.status}</span>
              </h1></div>
            <div className="col-auto">
              {meeting.status === MeetingStatus.PENDING &&
              <button className="btn btn-danger" onClick={() => this.cancelReservation()}>لغو</button>}
              {meeting.status === MeetingStatus.ELECTING &&
              <button className="btn btn-danger" onClick={() => this.closePoll()}>بستن نظرسنجی</button>}
            </div>
          </div>
        </div>
      </div>
      <div className="card text-white bg-dark mt-2">
        <div className="card-header">گزینه ها</div>
        <div className="card-body">

          {(meeting.status === MeetingStatus.ELECTING || meeting.status === MeetingStatus.CLOSED) ? (
            <ul className="list-group">
              {meeting.slots.map((slot: MeetingPoll, index: number) => (
                <li className="list-group-item list-group-item-dark" key={index}>
                  <ReservableTimeSlotComponent
                    selected={this.state.selectedTimeSlot === index}
                    timeSlot={slot}
                    meetingId={this.props.match.params.meetingId}
                    reserveCallback={() => this.getMeeting()}
                    getRoomsFailCallback={() => this.clearSelectedTimeSlot()}
                    pageEntryTime={this.state.pageEntryTime}
                    email={this.props.match.params.email}
                    closed={meeting!!.status === MeetingStatus.CLOSED}
                  />
                  {
                    this.isOwner() && this.state.selectedTimeSlot !== index &&
                    <div className="mt-2">
                        <button className="btn btn-primary" onClick={() => this.selectTimeSlot(index)}>انتخاب</button>
                    </div>
                  }
                  {
                    this.props.match.params.email !== undefined && (
                      <button onClick={() => {
                        this.deleteMeetingSlot(slot.time)
                      }} className="btn btn-outline-danger btn-sm float-right"><i className="fas fa-trash"/></button>
                    )
                  }
                </li>
              ))}
            </ul>
          ) : [
            (meeting.status === MeetingStatus.PENDING || meeting.status === MeetingStatus.RESERVED) ?
              <ReservedTimeSlot time={meeting.time} roomId={meeting.roomId}/>
              :
              <p>No option available</p>
          ]}

        </div>
      </div>
      {meeting.status === MeetingStatus.ELECTING && this.isOwner() ? additionalOptionForm : null}
      {meeting.status === MeetingStatus.ELECTING && this.isOwner() ? additionalGuestForm : null}
      <div className="card text-white bg-dark mt-2">
        <div className="card-header"><h4>Comments</h4></div>
        <div className="card-body">
          <form onSubmit={(e) => this.handleAddComment(e)}>
            <div className="form-group">
              <label htmlFor="inputPassword2" className="sr-only">متن</label>
              <textarea className="form-control" id="inputCommentContent" placeholder="متن"
                        onChange={(e) => this.handleCommentChange(e)}
                        value={this.state.commentContent}/>
            </div>
            <button type="submit" className="btn btn-primary mb-2">ثبت کامنت جدید</button>
          </form>
          <div className="list-group mt-3">
            {meeting.comments.map((comment: CommentModel, index: number) => (
              <CommentItem key={index} parentComment={comment} comment={comment}
                           updateCallback={(cm) => this.commentUpdate(cm)}
                           deleteCallback={() => this.deleteComment(comment)}
                           isMeetingOwner={this.isOwner()}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  }

  handleCommentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({...this.state, commentContent: e.target.value});
  }

  handleAddComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    Api.addCommentForMeeting(this.state.meeting!!.id, this.state.commentContent)
      .then(response => {
        let meeting = this.state.meeting;
        let commentContent = "";
        meeting!!.comments.unshift(response.data);
        this.setState({meeting, commentContent});
        ToastUtils.success("Comment added successfully");
      })
  }

  commentUpdate(newComment: CommentModel) {
    const meeting = this.state.meeting;
    meeting!!.comments = meeting!!.comments.map(comment => {
      if (comment.id === newComment.id) {
        return newComment;
      } else {
        return comment;
      }
    });
    this.setState({meeting})
  }

  private deleteComment(deletedComment: CommentModel) {
    const meeting = this.state.meeting;
    meeting!!.comments = meeting!!.comments.filter(comment => comment.id !== deletedComment.id);
    this.setState({meeting})
  }
}

interface State {
  meeting: Meeting | undefined
  selectedTimeSlot: number | undefined
  pageEntryTime: Date
  commentContent: string,
  newSlotStart: number,
  newSlotEnd: number,
  user: User | undefined,
  guestEmail: string,
  redirectLink: string | undefined
}

interface MatchParams {
  meetingId: string
  email: string | undefined
}

interface Props extends RouteComponentProps<MatchParams> {
}