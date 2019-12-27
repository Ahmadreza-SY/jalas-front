import React, {Component} from 'react';
import {User} from '../../api/models/UserModels';

export default class Header extends Component<Props, State> {
  render() {
    if (this.props.user === undefined)
      return <div/>;
    return <nav className="navbar">
      <span className="navbar-brand">Hi {this.props.user!!.firstName} {this.props.user!!.lastName}</span>
      <div className="collapse navbar-collapse" id="navbarSupportedContent"></div>
    </nav>
  }
}

interface Props {
  user: User | undefined
}

interface State {
}
