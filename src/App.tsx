import React from 'react';
import logo from './logo.svg';
import './App.css';
import Meeting from './components/meeting/Meeting';


const App: React.FC = () => {
  return (
    <div className="App">

      <header className="App-header">
        <Meeting id={"5de101629cde7661f67be93b"}/>
        <img src={logo} className="App-logo" alt="logo"/>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-links"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
