import React, {Component} from 'react';
import Api from '../../api/Api';
import {RouteComponentProps} from 'react-router';
import {Redirect} from 'react-router-dom';
import {NotificationType, User} from "../../api/models/UserModels";
import ToastUtils from "../../utils/ToastUtils";
import "./Profile.css";

export default class Profile extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      user: undefined,
      redirectLink: undefined,
      notificationTypes: {
        [NotificationType.MEETING_INVITATION]: false,
        [NotificationType.MEETING_VOTE]: false,
        [NotificationType.MEETING_REMOVE_GUEST]: false,
        [NotificationType.MEETING_RESERVATION]: false
      }
    }
  }

  componentDidMount(): void {
    Api.profile().then(response => {
      let redirectLink = undefined;
      if (response.data.isAdmin) {
        redirectLink = `/report`;
      }
      let notificationTypes = this.state.notificationTypes;
      response.data.notificationTypes.forEach(type => notificationTypes[type] = true);
      this.setState({user: response.data, redirectLink, notificationTypes})
    });
  }

  renderType(type: NotificationType) {
    return <li className="list-group-item list-group-item-dark">
      {type}
      <input type="checkbox" className="form-check-input"
             defaultChecked={this.state.notificationTypes[type]}
             onChange={e => {
               let notificationTypes = this.state.notificationTypes;
               notificationTypes[type] = !notificationTypes[type];
               this.setState({notificationTypes})
             }}
      />
    </li>;
  }

  updateTypes() {
    let typesMap = this.state.notificationTypes;
    let types: NotificationType[] = [];

    if (typesMap.MEETING_INVITATION)
      types.push(NotificationType.MEETING_INVITATION);
    if (typesMap.MEETING_VOTE)
      types.push(NotificationType.MEETING_VOTE);
    if (typesMap.MEETING_REMOVE_GUEST)
      types.push(NotificationType.MEETING_REMOVE_GUEST);
    if (typesMap.MEETING_RESERVATION)
      types.push(NotificationType.MEETING_RESERVATION);

    console.log(types);
    Api.updateNotificationTypes(types).then(response => {
      ToastUtils.success("Notification updated");
      let user = this.state.user;
      user!!.notificationTypes = types;
      this.setState({user})
    });
  }

  render() {
    if (this.state.redirectLink !== undefined)
      return <Redirect to={this.state.redirectLink}/>;

    let user = this.state.user;
    if (!user)
      return <div className="spinner-border"/>;

    return <div>
      <div className="card text-white bg-dark">
        <div className="card-header">
          Notification Types
        </div>
        <div className="card-body">
          <ul className="list-group">
            {this.renderType(NotificationType.MEETING_INVITATION)}
            {this.renderType(NotificationType.MEETING_VOTE)}
            {this.renderType(NotificationType.MEETING_REMOVE_GUEST)}
            {this.renderType(NotificationType.MEETING_RESERVATION)}
          </ul>
        </div>
        <button type="submit" className="btn btn-primary" onClick={e => this.updateTypes()}>Update</button>
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
  notificationTypes: Record<NotificationType, boolean>
}
