import React, {Component} from 'react';
import {TimeRange} from '../../api/models/MeetingModels';
import TimeSlotGeneralInfo from './TimeSlotGeneralInfo';

export default class ReservedTimeSlot extends Component<Props, {}> {

  render() {
    return <div className="list-group">
      <div className="list-group-item list-group-item-dark">
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
