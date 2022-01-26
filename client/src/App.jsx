import React from 'react';
import ReactDom from 'react-dom';
import './App.css';
import Timer from './components/Timer.jsx';
import utils from '../../utils';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: utils.minsToMs(0.25),
      breakLength: utils.minsToMs(5),
    };
  }

  componentDidMount() {

  }

  render() {
    const { sessionLength, breakLength } = this.state;
    return (
      <div>
        <h1>Tomato clock</h1>
        <Timer
          sessionLength={sessionLength}
          breakLength={breakLength}
        />
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
