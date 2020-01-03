import React, {ChangeEvent, Component, FormEvent} from 'react';
import Api from '../../api/Api';
import {CommentModel, Meeting, MeetingPoll, MeetingStatus, TimeRange} from '../../api/models/MeetingModels';
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
    Api.updateMeeting(
      this.props.match.params.meetingId,
      new TimeRange(this.state.newSlotStart, this.state.newSlotEnd)
    )
      .then(response => {
        let meeting = response.data;
        this.setState({meeting});
        ToastUtils.success("New slot added successfully");
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
                <span className="badge badge-dark ml-2">{meeting.status}</span>
              </h1></div>
            <div className="col-auto">
              {meeting.status === MeetingStatus.PENDING &&
              <button className="btn btn-danger" onClick={() => this.cancelReservation()}>لغو</button>}
            </div>
          </div>
        </div>
      </div>
      <div className="card text-white bg-dark mt-2">
        <div className="card-header">گزینه ها</div>
        <div className="card-body">

          {meeting.status === MeetingStatus.ELECTING ? (
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
                  />
                  {
                    this.isOwner() && this.state.selectedTimeSlot !== index &&
                    <div className="mt-2">
                        <button className="btn btn-primary" onClick={() => this.selectTimeSlot(index)}>انتخاب</button>
                    </div>
                  }
                </li>
              ))}
            </ul>
          ) : (
            <ReservedTimeSlot time={meeting.time} roomId={meeting.roomId}/>
          )}

        </div>
      </div>
      {meeting.status === MeetingStatus.ELECTING ? additionalOptionForm : null}
      <div className="card text-white bg-dark mt-2">
        <div className="card-header"><h4>Comments</h4></div>
        <div className="card-body">
          <form onSubmit={(e) => this.handleAddComment(e)}>
            <div className="form-group">
              <label htmlFor="inputPassword2" className="sr-only">متن</label>
              <textarea className="form-control" id="inputCommentContent" placeholder="متن"
                        onChange={(e) => this.handleCommentChange(e)}
                        value={this.state.commentContent}></textarea>
            </div>
            <button type="submit" className="btn btn-primary mb-2">ثبت کامنت جدید</button>
          </form>
          <div className="list-group mt-3">
            {meeting.comments.map((comment: CommentModel, index: number) => (
              <CommentItem key={index} parentComment={comment} comment={comment}/>
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
}

interface State {
  meeting: Meeting | undefined
  selectedTimeSlot: number | undefined
  pageEntryTime: Date
  commentContent: string,
  newSlotStart: number,
  newSlotEnd: number,
  user: User | undefined,
  redirectLink: string | undefined
}

interface MatchParams {
  meetingId: string
  email: string | undefined
}

interface Props extends RouteComponentProps<MatchParams> {
}