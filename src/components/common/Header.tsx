import React, {Component} from 'react';
import {User} from '../../api/models/UserModels';
import {Redirect} from "react-router-dom";
import ToastUtils from "../../utils/ToastUtils";

export default class Header extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {redirect: false}
  }

  render() {
    if (this.state.redirect)
      return <Redirect to="/login"/>;
    if (this.props.user === undefined)
      return <div/>;
    return <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <span className="navbar-brand">Hi {this.props.user!!.firstName} {this.props.user!!.lastName}</span>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit"
                onClick={() => this.logout()}>
          Logout
        </button>
      </div>
    </nav>
  }

  logout() {
    localStorage.clear();
    ToastUtils.success("Successfully logged out");
    this.setState({redirect: true})
  }
}

interface Props {
  user: User | undefined
}

interface State {
  redirect: boolean
}
