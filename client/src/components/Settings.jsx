import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../utils';
import enums from '../../../enums';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedSessionLength: '',
      updatedBreakLength: '',
      updatedRewardType: '',
    };
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    const { sessionLength, breakLength } = this.props;
    this.setState({
      updatedBreakLength: utils.MSToMins(breakLength),
      updatedSessionLength: utils.MSToMins(sessionLength),
    });
  }

  handleInputChange(e) {
    const { id, value } = e.target;
    if (id === 'break-length') this.setState({ updatedBreakLength: value });
    if (id === 'session-length') this.setState({ updatedSessionLength: value });
    if (id === 'reward') this.setState({ updatedRewardType: value });
  }

  render() {
    const { updatedBreakLength, updatedSessionLength, updatedRewardType } = this.state;
    const { rewardType, handleSettingsUpdate } = this.props;
    return (
      <div id="settings-container">
        <label htmlFor="session-length">
          Work session length&nbsp;
        </label>
        <input
          type="number"
          id="session-length"
          min="0"
          max="60"
          onChange={this.handleInputChange}
          value={updatedSessionLength}
        />
&nbsp;mins
        <br />
        <label htmlFor="break-length">
          Break length&nbsp;
        </label>
        <input
          type="number"
          id="break-length"
          min="0"
          max="60"
          onChange={this.handleInputChange}
          value={updatedBreakLength}
        />
&nbsp;mins
        <br />

        <label htmlFor="reward">
          Reward&nbsp;
        </label>
        <select
          id="reward"
          onChange={this.handleInputChange}
        >
          {
            enums.rewards.map((reward) => (
              <option
                selected={rewardType === reward.toLowerCase()}
                value={reward.toLowerCase()}
              >
                {reward}
              </option>
            ))
          }
        </select>

        <br />

        <input
          onClick={() => handleSettingsUpdate(
            utils.minsToMs(updatedSessionLength),
            utils.minsToMs(updatedBreakLength),
            updatedRewardType || rewardType,
          )}
          type="submit"
          value="Save"
        />
      </div>
    );
  }
}

Settings.propTypes = {
  sessionLength: PropTypes.number.isRequired,
  breakLength: PropTypes.number.isRequired,
  handleSettingsUpdate: PropTypes.func.isRequired,
};

export default Settings;
