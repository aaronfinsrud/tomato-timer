import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../utils';

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inBreak: false,
      stopped: true,
      timeRemaining: null,
      intervalId: null,
    };
    this.toggleStopped = this.toggleStopped.bind(this);
    this.updateTimeRemaining = this.updateTimeRemaining.bind(this);
    this.toggleInBreak = this.toggleInBreak.bind(this);
  }

  componentDidMount() {
    const { sessionLength } = this.props;
    this.setState({
      timeRemaining: sessionLength,
    });
  }

  toggleStopped() {
    const { stopped } = this.state;
    let { intervalId } = this.state;
    this.setState({ stopped: !stopped });
    if (stopped) {
      intervalId = setInterval(this.updateTimeRemaining, 1000);
      this.setState({ intervalId });
    } else {
      clearInterval(intervalId);
    }
  }

  toggleInBreak() {
    const { inBreak } = this.state;
    const { sessionLength, breakLength } = this.props;
    const timeRemaining = inBreak ? sessionLength : breakLength;
    this.setState({ inBreak: !inBreak, timeRemaining });
    this.toggleStopped();
  }

  updateTimeRemaining() {
    const { timeRemaining, intervalId } = this.state;
    if (timeRemaining <= 0) {
      this.toggleInBreak();
      clearInterval(intervalId);
    } else {
      this.setState({ timeRemaining: timeRemaining - utils.secsToMS(1) });
    }
  }

  render() {
    const { inBreak, stopped, timeRemaining } = this.state;
    return (
      <div>
        <div>
          {inBreak ? 'Break Time!' : 'Work Time!'}
        </div>
        <div>
          {utils.MSToMinutesAndSeconds(timeRemaining)}
        </div>
        <button
          type="button"
          onClick={this.toggleStopped}
        >
          {stopped ? 'Start' : 'Stop'}
        </button>
      </div>
    );
  }
}

Timer.propTypes = {
  sessionLength: PropTypes.number.isRequired,
  breakLength: PropTypes.number.isRequired,
};

export default Timer;
