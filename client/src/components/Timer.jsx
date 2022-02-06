import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../utils';
import SVGs from '../assets/SVGs.jsx';

function Timer({
  inBreak, isStopped, timeRemaining, toggleStopped,
}) {
  return (
    <div id="timer-container">
      {SVGs.tomato()}
      <div id="timer-interface-container">
        <div>
          {inBreak ? 'Break Time!' : 'Work Time!'}
        </div>
        <div>
          {utils.MSToMinutesAndSeconds(timeRemaining)}
        </div>
        <button
          name="toggle-timer"
          type="button"
          onClick={toggleStopped}
        >
          {isStopped ? 'Start' : 'Stop'}
        </button>
      </div>
    </div>
  );
}

Timer.propTypes = {
  inBreak: PropTypes.bool.isRequired,
  isStopped: PropTypes.bool.isRequired,
  timeRemaining: PropTypes.number.isRequired,
  toggleStopped: PropTypes.func.isRequired,
};

export default Timer;
