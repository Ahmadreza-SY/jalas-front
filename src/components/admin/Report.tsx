import React, {Component} from 'react';
import Api from '../../api/Api';
import {RouteComponentProps} from 'react-router';
import {Redirect} from 'react-router-dom';
import {User} from "../../api/models/UserModels";
import {GeneralReport} from "../../api/models/StatModels";
import ToastUtils from "../../utils/ToastUtils";
import "./Report.css";
import TimeUtils from "../../utils/TimeUtils";

export default class Report extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      user: undefined,
      redirectLink: undefined,
      report: undefined
    }
  }

  componentDidMount(): void {
    Api.profile().then(response => {
      let redirectLink = undefined;
      if (!response.data.isAdmin) {
        ToastUtils.error("You are not admin!");
        redirectLink = `/meeting`;
      }
      this.setState({user: response.data, redirectLink})
    });
    Api.report().then(response => {
      this.setState({report: response.data})
    });
  }

  render() {
    if (this.state.redirectLink !== undefined)
      return <Redirect to={this.state.redirectLink}/>;

    let report = this.state.report;
    if (!report)
      return <div className="spinner-border"/>;

    return <div>
      <div className="card text-white bg-dark">
        <div className="card-header">
          Quality in Use
        </div>
        <div className="card-body">
          <ul className="list-group">
            <li className="list-group-item list-group-item-dark">
              جلسه‌های لغو شده
              <span className="badge badge-light ml-2">{report.canceledMeetingsCount}</span>
            </li>
            <li className="list-group-item list-group-item-dark">
              میانگین زمان نهایی کردن جلسه
              <span className="badge badge-light ml-2">{TimeUtils.getDuration(0, report.reservationTimeAvg)}</span>
            </li>
            <li className="list-group-item list-group-item-dark">
              تعداد اتاق‌های رزرو شده
              <span className="badge badge-light ml-2">{report.reservedRoomsCount}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  }
}

interface MatchParams {
}

interface Props extends RouteComponentProps<MatchParams> {
}

interface State {
  user: User | undefined,
  redirectLink: string | undefined,
  report: GeneralReport | undefined
}
