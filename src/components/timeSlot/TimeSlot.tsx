import React, {ChangeEvent, Component} from 'react';
import {MeetingPoll} from '../../api/models/Meeting';
import Api from '../../api/Api';
import ToastUtils from '../../utils/ToastUtils';

export default class TimeSlotComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {availableRooms: [], selectedRoom: undefined}
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
        ToastUtils.error(error.message)
      })
  }

  selectRoom(event: ChangeEvent<HTMLSelectElement>) {
    this.setState({...this.state, selectedRoom: parseInt(event.target.value)})
  }


  render() {
    return <div>
      <div>
        <p>
          {this.props.timeSlot.time.start}
        </p>
        <p>
          {this.props.timeSlot.time.end}
        </p>

        <p>{this.props.timeSlot.agreeingUsers.length} موافق</p>
        <p>{this.props.timeSlot.disagreeingUsers.length} مخالف</p>
        {
          this.props.selected && <select onChange={(event) => this.selectRoom(event)} name="rooms">
            {
              this.state.availableRooms.map((item: number) =>
                <option key={item} value={item}>{item}</option>
              )
            }
          </select>
        }
      </div>
    </div>
  }
}

interface Props {
  timeSlot: MeetingPoll
  selected: boolean
}

interface State {
  availableRooms: number[]
  selectedRoom: number | undefined
}