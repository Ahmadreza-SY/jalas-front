import React, {ChangeEvent, Component} from 'react';
import {MeetingPoll} from '../../api/models/Meeting';
import Api from '../../api/Api';
import ToastUtils from '../../utils/ToastUtils';
import TimeSlotGeneralInfo from './TimeSlotGeneralInfo';

export default class ReservableTimeSlotComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {availableRooms: [], selectedRoom: undefined, fetchError: false}
  }

  componentWillReceiveProps(nextProps: Readonly<Props>): void {
    if (nextProps.selected)
      this.getAvailableRooms();
    else {
      this.setState({availableRooms: [], selectedRoom: undefined})
    }
  }

  getAvailableRooms() {
    Api
      .getAvailableRooms(this.props.timeSlot.time.start, this.props.timeSlot.time.end)
      .then(response => {
        this.setState({...this.state, availableRooms: response.data.availableRooms})
      })
      .catch(error => {
        ToastUtils.error("Error in getting rooms. Please try again");
        this.setState({...this.state, fetchError: true});
        this.props.getRoomsFailCallback()
      })
  }

  selectRoom(event: ChangeEvent<HTMLSelectElement>) {
    this.setState({...this.state, selectedRoom: parseInt(event.target.value)})
  }

  showReserveOptions() {
    return <div>
      <select onChange={(event) => this.selectRoom(event)} name="rooms">
        {
          this.state.availableRooms.map((item: number) =>
            <option key={item} value={item}>{item}</option>
          )
        }
      </select>
      <button color="green" onClick={() => this.reserveRoom()}>رزرو</button>
    </div>
  }

  reserveRoom() {
    Api
      .reserveRoom(this.props.meetingId, this.state.selectedRoom!!, this.props.timeSlot.time, this.props.pageEntryTime)
      .then(response => {
        ToastUtils.success("Reserved Successfully");
        this.props.reserveCallback()
      })
      .catch(error => {
        ToastUtils.error(error.response.data.message);
        if (error.status === 400) {
          this.getAvailableRooms()
        } else {
          this.props.reserveCallback()
        }
      })
  }

  render() {
    return <div>
      <div>
        <TimeSlotGeneralInfo time={this.props.timeSlot.time}/>
        <p>{this.props.timeSlot.agreeingUsers.length} موافق</p>
        <p>{this.props.timeSlot.disagreeingUsers.length} مخالف</p>
        {(this.props.selected && this.state.availableRooms.length > 0) && this.showReserveOptions()}
      </div>
    </div>
  }
}

interface Props {
  timeSlot: MeetingPoll
  selected: boolean
  meetingId: string
  reserveCallback: () => void
  pageEntryTime: Date
  getRoomsFailCallback: () => void
}

interface State {
  availableRooms: number[]
  selectedRoom: number | undefined
  fetchError: boolean
}