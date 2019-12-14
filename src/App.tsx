import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import './App.css';
import MeetingComponent from './components/meeting/Meeting';
import MeetingList from './components/meetingList/MeetingList';
import NewMeeting from './components/newMeeting/NewMeeting';


const App: React.FC = () => {
  return (
    <div className="App App-header">
      <Router>
        <Switch>
          <Route exact path={"/meeting"} component={MeetingList}/>
          <Route exact path={"/meeting/new"} component={NewMeeting}/>
          <Route exact path="/meeting/:meetingId" component={MeetingComponent}/>
          <Route exact path="/meeting/:meetingId/vote/:email" component={MeetingComponent}/>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
