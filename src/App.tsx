import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import './App.css';
import MeetingComponent from './components/meeting/Meeting';


const App: React.FC = () => {
  return (

    <Router>
      <div className="App App-header">
        <Route path="/meeting/:meetingId" component={MeetingComponent}/>
      </div>
    </Router>
  );
};

export default App;
