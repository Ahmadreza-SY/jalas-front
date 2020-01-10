import React, {ChangeEvent, Component} from 'react';
import {TimeRange} from '../../api/models/MeetingModels';
import TimeUtils from '../../utils/TimeUtils';
import Api from '../../api/Api';
import {RouteComponentProps} from 'react-router';
import {Redirect} from 'react-router-dom';
import {User} from '../../api/models/UserModels';

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
      redirectLink: undefined,
      user: undefined,
      deadline: undefined
    }
  }

  componentDidMount() {
    Api.profile().then(response => {
      let redirectLink = undefined;
      if (response.data.isAdmin)
        redirectLink = `/report`;
      this.setState({user: response.data, redirectLink})
    });
  }

  addSlot() {
    if (this.state.start === 0 || this.state.end === 0)
      return;
    const slots = this.state.slots;
    slots.push(new TimeRange(this.state.start, this.state.end));
    this.setState({...this.state, slots})
  }

  addEmail() {
    if (this.state.email.trim() === "")
      return;
    const guests = this.state.guests;
    guests.push(this.state.email);
    this.setState({...this.state, guests, email: ""})
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

  updateDeadline(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.value)
      return;
    const date = new Date(e.target.value);
    this.setState({...this.state, deadline: date.getTime()})
  }

  updateEmail(e: ChangeEvent<HTMLInputElement>) {
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
    return <div className="card text-white bg-dark">
      <div className="card-header"><h5>Slots</h5></div>
      <div className="card-body">
        {this.state.slots.map((slot: TimeRange, index: number) => (
          <div className="row" key={index}>
            <p className="col">Start: {TimeUtils.getDateTimeFormat(slot.start, false)}</p>
            <p className="col">End: {TimeUtils.getDateTimeFormat(slot.end, false)}</p>
            <div className="col-auto">
              <button onClick={() => this.deleteSlot(index)}>Delete</button>
            </div>
            <hr/>
          </div>
        ))}
        <div className="row align-items-end">
          <div className="col"><span>Start</span>
            <input className="form-control" onChange={(e) => this.updateStart(e)} type="datetime-local"/>
          </div>
          <div className="col"><span> End </span>
            <input className="form-control" onChange={(e) => this.updateEnd(e)} type="datetime-local"/></div>
          <div className="col-auto">
            <button className="btn btn-primary" onClick={() => this.addSlot()}>Add</button>
          </div>
        </div>
      </div>
    </div>
  }

  showGuests() {
    return <div className="card text-white bg-dark">
      <div className="card-header"><h5>Guests</h5></div>
      <div className="card-body">
        <div className="row mb-3">
          {this.state.guests.map((guest: string, index: number) => (
              <div className="col-auto mb-2" key={index}>
                <span className="mr-1">{guest}</span>
                <button className="btn btn-danger" onClick={() => this.deleteGuest(index)}>
                  <i className="fas fa-trash"/>
                </button>
              </div>
            )
          )}
        </div>
        <div className="row">
          <div className="col">
            <input className="form-control" onChange={(e) => this.updateEmail(e)} type="email"
                   placeholder="Invitee Email" value={this.state.email}/>
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={() => this.addEmail()}> Add</button>
          </div>
        </div>
      </div>
    </div>

  }

  createMeeting() {
    Api
      .createMeeting(this.state.title, this.state.slots, this.state.guests, this.state.deadline)
      .then(response => {
        this.setState({redirectLink: `/meeting/${response.data.id}`})
      })
  }

  render() {
    if (this.state.redirectLink !== undefined)
      return <Redirect to={this.state.redirectLink}/>;
    return <div className="row text-left">
      <label className="col-12">
        <div className="card text-white bg-dark">
          <div className="card-header"><h5>Title</h5></div>
          <div className="card-body">
            <input className="form-control" onChange={(e) => this.updateTitle(e)} type="text"/>
          </div>
        </div>
      </label>
      <div className="col-12 mb-3">{this.showSlots()}</div>
      <div className="col-12 mb-3">{this.showGuests()}</div>
      <div className="col-12 mb-3">
        <div className="card text-white bg-dark">
          <div className="card-header"><h5>Deadline?</h5></div>
          <div className="card-body">
            <input className="form-control" onChange={(e) => this.updateDeadline(e)}
                   type="datetime-local"/>
          </div>
        </div>
      </div>
      <div className="col-12">
        <input className="btn btn-success" onClick={() => this.createMeeting()} type="submit"
               value="Submit"/>
      </div>
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
  user: User | undefined,
  deadline: number | undefined
}
