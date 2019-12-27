import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ToastUtils from '../../utils/ToastUtils';
import Api from '../../api/Api';
import {User} from '../../api/models/UserModels';
import Header from './Header';
import { withRouter, RouteComponentProps } from "react-router";

class Nav extends Component<Props, State> {
	historyListener: any;

  constructor(props: Props) {
    super(props);
    this.state = {redirect: false, user: undefined}
  }

  componentDidMount(): void {
	  this.props.history.listen(data => {
		  this.getUserInfo()
	  })
	  this.getUserInfo()
  }

  getUserInfo() {
	  if (!localStorage.getItem("token")) return;
		Api.profile().then(response => {
			this.setState({ user: response.data });
		});
  }

  logout() {
    localStorage.clear();
    ToastUtils.success("Successfully logged out");
    window.location.href = '/login'
  }

  render() {
    const {user} = this.state;
    return (
      <div className="text-left">
        <Header user={user}/>
        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
          <Link className="nav-link" to="/meeting"
                aria-controls="v-pills-home" aria-selected="true">Meeting</Link>
          <Link className="nav-link" to="/meeting/new"
                aria-controls="v-pills-profile" aria-selected="false">New Meeting</Link>
          {user && user.isAdmin && <Link className="nav-link" to="/report"
                                         aria-controls="v-pills-messages" aria-selected="false">Report</Link>}
          <button className="nav-link clickable btn btn-link text-left" onClick={() => this.logout()}
                  aria-controls="v-pills-settings" aria-selected="false">Logout
          </button>
        </div>
      </div>)
  }
}


interface Props extends RouteComponentProps {
}
interface State {

  user: User | undefined,
  redirect: boolean
}

export default withRouter(Nav);