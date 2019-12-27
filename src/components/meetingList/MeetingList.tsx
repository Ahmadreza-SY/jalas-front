import React, {Component} from "react";
import {Link, Redirect} from "react-router-dom";
import MeetingItem from "./MeetingItem";
import {Meeting} from "../../api/models/MeetingModels";
import Api from "../../api/Api";
import Header from "../common/Header";
import {User} from "../../api/models/UserModels";

export default class MeetingList extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      meetings: [],
      user: undefined,
      redirectLink: undefined,
      myPolls: false
    };
  }

  componentDidMount(): void {
    this.getMeetings();
    Api.profile().then(response => {
      let redirectLink = undefined;
      if (response.data.isAdmin)
        redirectLink = `/report`;
      this.setState({user: response.data, redirectLink})
    })
  }

  getMeetings() {
    Api.getMeetings().then(response => {
      this.setState({
        ...this.state,
        meetings: response.data
      });
    });
  }

  filterPolls() {
    let myPollsChecked = !this.state.myPolls;
    if (myPollsChecked) {
      Api.getPolls().then(response => {
        this.setState({myPolls: myPollsChecked, meetings: response.data});
      })
    } else {
      this.getMeetings()
    }
  }

  render() {
    if (this.state.redirectLink !== undefined)
      return <Redirect to={this.state.redirectLink}/>;
    return (
      <div>
        <Link to="/meeting/new">
          <button>Create New Poll</button>
        </Link>
        <hr/>
        <br/>
        <label>
          <input
            type="checkbox"
            className="form-control"
            defaultChecked={this.state.myPolls}
            onChange={() =>
              this.filterPolls()
            }
          />
          جلسات من
        </label>
        <ul>
          {this.state.meetings.map(
            (meeting: Meeting, index: number) => (
              <li key={index}>
                <MeetingItem
                  id={meeting.id}
                  title={meeting.title}
                  state={meeting.status}
                />
                <hr/>
              </li>
            )
          )}
        </ul>
      </div>
    );
  }
}

interface Props {
}

interface State {
  meetings: Meeting[]
  user: User | undefined
  redirectLink: string | undefined
  myPolls: boolean
}
