import React, {Component} from 'react';
import TimeUtils from '../../utils/TimeUtils';
import {TimeRange} from '../../api/models/Meeting';

export default class TimeSlotGeneralInfo extends Component<Props, {}> {

  render() {
    return <div>
      <p>{TimeUtils.getDateFormat(this.props.time.start)} روز</p>
      <p>
        ساعت&nbsp;
        {TimeUtils.getClockFormat(this.props.time.start)}
        -
        {TimeUtils.getClockFormat(this.props.time.end)}
      </p>
      <p>{TimeUtils.getDuration(this.props.time.start, this.props.time.end)} مدت</p>
    </div>
  }
}

interface Props {
  time: TimeRange
}