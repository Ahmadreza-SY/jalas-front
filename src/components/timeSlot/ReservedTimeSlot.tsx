import React, {Component} from 'react';
import {TimeRange} from '../../api/models/Meeting';
import TimeSlotGeneralInfo from './TimeSlotGeneralInfo';

export default class ReservedTimeSlot extends Component<Props, {}> {

  render() {
    return <div>
      <div>
        <TimeSlotGeneralInfo time={this.props.time}/>
        <p>{this.props.roomId} اتاق</p>
      </div>
    </div>
  }
}

interface Props {
  time: TimeRange
  roomId: number
}
