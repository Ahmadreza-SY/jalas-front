import React, {Component} from 'react';
import Api from '../../api/Api';
import Meeting, {MeetingPoll} from '../../api/models/Meeting';
import TimeSlotComponent from '../timeSlot/TimeSlot';

export default class MeetingComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {meeting: undefined, selectedTimeSlot: undefined}
  }

  componentDidMount(): void {
    Api.getMeeting(this.props.id).then(response => {
      console.log(response);
      this.setState({...this.state, meeting: response.data});
    })
  }

  selectTimeSlot(index: number) {
    this.setState({...this.state, selectedTimeSlot: index})
  }

  render() {
    if (!this.state.meeting)
      return <h1>Loading...</h1>;
    return <div>
      <h1>
        {this.state.meeting.title}
      </h1>
      <ul>
        {this.state.meeting.slots.map((item: MeetingPoll, index: number) => (
          <li key={index}>
            <TimeSlotComponent
              selected={this.state.selectedTimeSlot === index} timeSlot={item}/>
            {this.state.selectedTimeSlot !== index &&
            <button onClick={() => this.selectTimeSlot(index)}>انتخاب</button>}
            <hr/>
          </li>
        ))}
      </ul>
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