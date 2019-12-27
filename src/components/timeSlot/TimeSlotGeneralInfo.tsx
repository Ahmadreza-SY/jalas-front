import React, {Component} from 'react';
import TimeUtils from '../../utils/TimeUtils';
import {TimeRange} from '../../api/models/MeetingModels';

export default class TimeSlotGeneralInfo extends Component<Props, {}> {

  render() {
    return <div className="row">
      <div className="col">{TimeUtils.getDateFormat(this.props.time.start)} روز</div>
      <div className="col">
        ساعت&nbsp;
        {TimeUtils.getClockFormat(this.props.time.start)}
        -
        {TimeUtils.getClockFormat(this.props.time.end)}
      </div>
      <div className="col">{TimeUtils.getDuration(this.props.time.start, this.props.time.end)} مدت</div>
    </div>
  }
}

interface Props {
  time: TimeRange
}