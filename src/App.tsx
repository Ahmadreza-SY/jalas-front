import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import MeetingComponent from './components/meeting/Meeting';
import MeetingList from './components/meetingList/MeetingList';
import NewMeeting from './components/newMeeting/NewMeeting';
import Login from "./components/login/Login";
import Report from "./components/admin/Report";
import Nav from './components/common/Nav';

export default class App extends Component<Props, State> {
  render() {
    return (
      <div className="App App-header">
        <div className="container">
          <Router>
            <div className="row">
              <div className="col-3">
                <Nav/>
              </div>
              <div className="col-9 text-left">
                <Switch>
                  <Route exact path="/login" component={Login}/>
                  <Route exact path="/meeting" component={MeetingList}/>
                  <Route exact path="/meeting/new" component={NewMeeting}/>
                  <Route exact path="/meeting/:meetingId" component={MeetingComponent}/>
                  <Route exact path="/meeting/:meetingId/vote/:email" component={MeetingComponent}/>
                  <Route exact path="/report" component={Report}/>
                </Switch>
              </div>
            </div>
          </Router>
        </div>
      </div>
    );
  }
};


interface Props {
}

interface State {
}