import React, {Component} from 'react';
import Api from '../../api/Api';
import Meeting, {MeetingPoll, MeetingStatus} from '../../api/models/Meeting';
import ReservableTimeSlotComponent from '../timeSlot/ReservableTimeSlot';
import ReservedTimeSlot from '../timeSlot/ReservedTimeSlot';
import {RouteComponentProps} from 'react-router';


export default class MeetingComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {meeting: undefined, selectedTimeSlot: undefined, pageEntryTime: new Date()}
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
              />
              {this.state.selectedTimeSlot !== index &&
              <button onClick={() => this.selectTimeSlot(index)}>انتخاب</button>}
              <hr/>
            </li>
          ))}
        </ul>
      ) : (
        <ReservedTimeSlot time={meeting.time} roomId={meeting.roomId}/>
      )}
      {meeting.status === MeetingStatus.PENDING && <button onClick={() => this.cancelReservation()}>لغو</button>}
    </div>
  }
}

interface State {
  meeting: Meeting | undefined
  selectedTimeSlot: number | undefined
  pageEntryTime: Date
}

interface MatchParams {
  meetingId: string
}

interface Props extends RouteComponentProps<MatchParams> {
}