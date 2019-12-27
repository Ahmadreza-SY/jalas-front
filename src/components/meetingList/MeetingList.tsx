import React, {Component} from "react";
import {Redirect} from "react-router-dom";
import MeetingItem from "./MeetingItem";
import {Meeting} from "../../api/models/MeetingModels";
import Api from "../../api/Api";
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
        <div className="card text-white bg-dark">
          <div className="card-header">
            <div className="row align-items-center">
              <h3 className="mb-0 col">جلسات من</h3>
              <div className="col-auto">
								<div className="form-check">
									<input
										type="checkbox"
										className="form-check-input"
										defaultChecked={this.state.myPolls}
										onChange={() => this.filterPolls()}
										id="defaultCheck1"
									/>
										<label className="form-check-label" htmlFor="defaultCheck1">
											نمایش نظرسنجی‌های من
										</label>
								</div>

              </div>
            </div>
          </div>
          <div className="card-body">
            <ul className="list-group">
              {this.state.meetings.map(
                (meeting: Meeting, index: number) => (
                  <MeetingItem key={index}
                               id={meeting.id}
                               title={meeting.title}
                               state={meeting.status}
                  />
                )
              )}
            </ul>
          </div>
        </div>
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
