import React, {ChangeEvent, Component, FormEvent} from 'react';
import Api from '../../api/Api';
import {RouteComponentProps} from 'react-router';
import ToastUtils from '../../utils/ToastUtils';
import {Redirect} from 'react-router-dom';

export default class Login extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      password: '',
      email: '',
      redirectLink: undefined
    }
  }

  handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({email: e.target.value})
  }

  handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    this.setState({password: e.target.value})
  }

  handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    Api
      .login(this.state.email, this.state.password)
      .then(response => {
        ToastUtils.success("Login Successfully");
        localStorage.setItem("token", `${response.data.type} ${response.data.token}`);
        this.setState({redirectLink: `/meeting`})
      })
  }

  render() {
    if (this.state.redirectLink)
      return <Redirect to={this.state.redirectLink}/>;
    return <form onSubmit={(e) => this.handleLogin(e)}>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">ایمیل</label>
        <input type="email" className="form-control" aria-describedby="emailHelp" placeholder="ایمیل"
               onChange={(e) => this.handleEmailChange(e)}
               value={this.state.email}/>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">کلمه‌ی عبور</label>
        <input type="password" className="form-control" placeholder="کلمه‌ی عبور"
               onChange={(e) => this.handlePasswordChange(e)}
               value={this.state.password}/>
      </div>
      <button type="submit" className="btn btn-primary">ورود</button>
    </form>
  }
}

interface MatchParams {
}

interface Props extends RouteComponentProps<MatchParams> {
}

interface State {
  email: string,
  password: string,
  redirectLink: string | undefined,
}
