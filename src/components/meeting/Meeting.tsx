import React, {Component} from 'react';
import Api from '../../api/Api';
import Meeting, {MeetingPoll, MeetingStatus} from '../../api/models/Meeting';
import ReservableTimeSlotComponent from '../timeSlot/ReservableTimeSlot';
import ReservedTimeSlot from '../timeSlot/ReservedTimeSlot';

export default class MeetingComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {meeting: undefined, selectedTimeSlot: undefined}
  }

  componentDidMount(): void {
    Api.getMeeting(this.props.id).then(response => {
      this.setState({...this.state, meeting: response.data});
    })
  }

  selectTimeSlot(index: number) {
    this.setState({...this.state, selectedTimeSlot: index})
  }

  render() {
    let meeting = this.state.meeting;
    if (!meeting)
      return <h1>Loading...</h1>;
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
                meetingId={this.props.id}
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
    </div>
  }
}

interface State {
  meeting: Meeting | undefined
  selectedTimeSlot: number | undefined
}

interface Props {
  id: string
}