import React, {ChangeEvent, Component} from 'react';
import {TimeRange} from '../../api/models/MeetingModels';
import TimeUtils from '../../utils/TimeUtils';
import Api from '../../api/Api';
import {RouteComponentProps} from 'react-router';
import ToastUtils from '../../utils/ToastUtils';
import {Redirect} from 'react-router-dom';

export default class NewMeeting extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      title: '',
      slots: [],
      guests: [],
      start: 0,
      end: 0,
      email: '',
      redirectLink: undefined
    }
  }


  addSlot() {
    if (this.state.start === 0 || this.state.end === 0)
      return;
    const slots = this.state.slots;
    slots.push(new TimeRange(this.state.start, this.state.end));
    this.setState({...this.state, slots})
  }

  addEmail() {
    const guests = this.state.guests;
    guests.push(this.state.email);
    this.setState({...this.state, guests})
  }

  updateStart(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value)
      return;
    const date = new Date(e.target.value);
    this.setState({...this.state, start: date.getTime()})
  }

  updateEnd(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value)
      return;
    const date = new Date(e.target.value);
    this.setState({...this.state, end: date.getTime()})
  }

  updateEmail(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value)
      return;
    this.setState({...this.state, email: e.target.value})
  }

  updateTitle(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value)
      return;
    this.setState({...this.state, title: e.target.value});
  }


  deleteSlot(index: number) {
    const slots = this.state.slots;
    slots.splice(index, 1);
    this.setState({...this.state, slots})
  }

  deleteGuest(index: number) {
    const guests = this.state.guests;
    guests.splice(index, 1);
    this.setState({...this.state, guests})
  }

  showSlots() {
    return <div>
      {this.state.slots.map((slot: TimeRange, index: number) => (
        <div key={index}>
          <p>Start: {TimeUtils.getDateTimeFormat(slot.start, false)}</p>
          <p>End: {TimeUtils.getDateTimeFormat(slot.end, false)}</p>
          <button onClick={() => this.deleteSlot(index)}>Delete</button>
          <hr/>
        </div>
      ))}
      <label>
        Slots
        Start
        <input onChange={(e) => this.updateStart(e)} type="datetime-local"/>
        End
        <input onChange={(e) => this.updateEnd(e)} type="datetime-local"/>
        <button onClick={() => this.addSlot()}>Add</button>
      </label>
    </div>
  }

  showGuests() {
    return <div>
      <label>Guests</label>
      {this.state.guests.map((guest: string, index: number) => (
          <div key={index}>
            <span>{guest}</span>
            <button onClick={() => this.deleteGuest(index)}>Delete</button>
          </div>
        )
      )}
      <input onChange={(e) => this.updateEmail(e)} type="email"/>
      <button onClick={() => this.addEmail()}> Add</button>
    </div>
  }

  createMeeting() {
    Api
      .createMeeting(this.state.title, this.state.slots, this.state.guests)
      .then(response => {
        this.setState({redirectLink: `/meeting/${response.data.id}`})
      })
      .catch(e => {
        ToastUtils.error(e.response.data.message)
      })
  }

  render() {
    if (this.state.redirectLink !== undefined)
      return <Redirect to={this.state.redirectLink}/>;
    return <div className="row">
      <label className="col-md-12">
        Title:
        <input onChange={(e) => this.updateTitle(e)} type="text"/>
      </label>
      {this.showSlots()}
      {this.showGuests()}
      <input onClick={() => this.createMeeting()} type="submit" value="Submit"/>
    </div>

  }
}

interface MatchParams {
}

interface Props extends RouteComponentProps<MatchParams> {
}

interface State {
  title: string;
  slots: TimeRange[],
  guests: string[]
  start: number,
  end: number
  email: string,
  redirectLink: string | undefined,
}
