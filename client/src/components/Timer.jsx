import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../utils';

function Timer({
  inBreak, isStopped, timeRemaining, toggleStopped,
}) {
  return (
    <div>
      <div className="container">
        <div id="tomato">
          <div id="tomatoTop" />
          <div id="tomatoFill" />
          <div id="timer-container">
            <div>
              {inBreak ? 'Break Time!' : 'Work Time!'}
            </div>
            <div>
              {utils.MSToMinutesAndSeconds(timeRemaining)}
            </div>
            <button
              type="button"
              onClick={toggleStopped}
            >
              {isStopped ? 'Start' : 'Stop'}
            </button>
          </div>
        </div>
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
