import React, {ChangeEvent, Component} from 'react';
import {MeetingPoll, VoteOption} from '../../api/models/MeetingModels';
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
    return <div className="mt-2 row no-gutters">
      <div className="col-auto">
        <select className="form-control" onChange={(event) => this.selectRoom(event)} name="rooms">
          {
            this.state.availableRooms.map((item: number) =>
              <option key={item} value={item}>{item}</option>
            )
          }
        </select></div>
      <div className="col-auto ml-2">
        <button className="btn btn-primary" color="green" onClick={() => this.reserveRoom()}>رزرو</button>
      </div>
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
        if (error.status === 400) {
          this.getAvailableRooms()
        } else {
          this.props.reserveCallback()
        }
      })
  }

  voteForMeeting(vote: VoteOption) {
    Api
      .voteForMeeting(this.props.meetingId, this.props.email!!, this.props.timeSlot.time, vote)
      .then(response => {
        ToastUtils.success("Vote Submitted Successfully");
        this.props.reserveCallback()
      })
  }

  hasAlreadyAgreed() {
    return this.props.timeSlot.agreeingUsers.includes(this.props.email!!)
  }

  hasAlreadyDisagreed() {
    return this.props.timeSlot.disagreeingUsers.includes(this.props.email!!)
  }

  render() {
    return <div>
      <div>
        <TimeSlotGeneralInfo time={this.props.timeSlot.time}/>
        <div className="row justify-content-center mt-2">
          <div className="col-auto">
            <span>{this.props.timeSlot.agreeingUsers.length}</span>
            <span className="mr-3">موافق</span>
            {
              this.props.email !== undefined && (
                this.hasAlreadyAgreed() ?
                  <button className="btn btn-outline-danger" disabled={this.props.closed}
                          onClick={(() => this.voteForMeeting(VoteOption.REVOKE))}>بازپس‌گیری</button>
                  :
                  <button className="btn btn-success" disabled={this.props.closed}
                          onClick={(() => this.voteForMeeting(VoteOption.AGREE))}>موافق</button>
              )
            }
          </div>
          <div className="col-auto">
            <span>{this.props.timeSlot.disagreeingUsers.length}</span><span className="mr-3"> مخالف</span>
            {
              this.props.email !== undefined && (
                this.hasAlreadyDisagreed() ?
                  <button className="btn btn-outline-danger" disabled={this.props.closed}
                          onClick={(() => this.voteForMeeting(VoteOption.REVOKE))}>بازپس‌گیری</button>
                  :
                  <button className="btn btn-danger" disabled={this.props.closed}
                          onClick={(() => this.voteForMeeting(VoteOption.DISAGREE))}>مخالف</button>
              )
            }
          </div>
        </div>
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
  email: string | undefined
  closed: boolean
}

interface State {
  availableRooms: number[]
  selectedRoom: number | undefined
  fetchError: boolean
}