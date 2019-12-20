import React, {Component, FormEvent} from 'react';
import Api from '../../api/Api';
import {CommentModel, Meeting, MeetingPoll, MeetingStatus} from '../../api/models/MeetingModels';
import ReservableTimeSlotComponent from '../timeSlot/ReservableTimeSlot';
import ReservedTimeSlot from '../timeSlot/ReservedTimeSlot';
import {RouteComponentProps} from 'react-router';
import CommentItem from './CommentItem';
import ToastUtils from "../../utils/ToastUtils";


export default class MeetingComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.handleAddComment = this.handleAddComment.bind(this);
    this.state = {
      meeting: undefined,
      selectedTimeSlot: undefined,
      pageEntryTime: new Date(),
      commentContent: ""
    };
  }

  componentDidMount(): void {
    this.getMeeting();
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.location.pathname === "/meeting/new")
      this.getMeeting()
  }

  getMeeting() {
    Api.getMeeting(this.props.match.params.meetingId).then(response => {
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

  isOwner() {
    return this.props.match.params.email === undefined || this.state.meeting!!.owner === this.props.match.params.email
  }

  render() {
    let meeting = this.state.meeting;
    if (!meeting)
      return <div className="spinner-border"/>;
    return <div>
      <h1>
        {meeting.title}
      </h1>
      <h3>{meeting.status} وضعیت فعلی</h3>
      {meeting.status === MeetingStatus.ELECTING ? (
        <ul>
          {meeting.slots.map((slot: MeetingPoll, index: number) => (
            <li key={index}>
              <ReservableTimeSlotComponent
                selected={this.state.selectedTimeSlot === index}
                timeSlot={slot}
                meetingId={this.props.match.params.meetingId}
                reserveCallback={() => this.getMeeting()}
                getRoomsFailCallback={() => this.clearSelectedTimeSlot()}
                pageEntryTime={this.state.pageEntryTime}
                email={this.props.match.params.email}
              />
              {
                this.isOwner() && this.state.selectedTimeSlot !== index &&
                <button className="btn btn-primary" onClick={() => this.selectTimeSlot(index)}>انتخاب</button>
              }
              <hr/>
            </li>
          ))}
        </ul>
      ) : (
        <ReservedTimeSlot time={meeting.time} roomId={meeting.roomId}/>
      )}
      {meeting.status === MeetingStatus.PENDING &&
      <button className="btn btn-danger" onClick={() => this.cancelReservation()}>لغو</button>}
      <div>
        <h4>Comments</h4>
        <div>
          <form className="form-inline" onSubmit={(e) => this.handleAddComment(e)}>
            <div className="form-group mx-sm-3 mb-2">
              <label htmlFor="inputPassword2" className="sr-only">متن</label>
              <input type="text" className="form-control" id="inputCommentContent" placeholder="متن"
                     onChange={(e) => this.handleCommentChange(e)}
                     value={this.state.commentContent}/>
            </div>
            <button type="submit" className="btn btn-primary mb-2">ثبت کامنت جدید</button>
          </form>
          {meeting.comments.map((comment: CommentModel, index: number) => (
            <CommentItem comment={comment}/>
          ))}
        </div>
      </div>
    </div>
  }

  handleCommentChange(e: React.ChangeEvent<HTMLInputElement>) {
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
      .catch(error => {
        ToastUtils.error(error.response.data.message);
      });
  }
}

interface State {
  meeting: Meeting | undefined
  selectedTimeSlot: number | undefined
  pageEntryTime: Date
  commentContent: string
}

interface MatchParams {
  meetingId: string
  email: string | undefined
}

interface Props extends RouteComponentProps<MatchParams> {
}