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
    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleSubmit(e) {
    e.preventDefault();
    const { updatedBreakLength, updatedSessionLength, updatedRewardType } = this.state;
    const { rewardType, handleSettingsUpdate } = this.props;
    handleSettingsUpdate(
      utils.minsToMs(updatedSessionLength),
      utils.minsToMs(updatedBreakLength),
      updatedRewardType || rewardType,
    );
  }

  render() {
    const { updatedBreakLength, updatedSessionLength } = this.state;
    const { rewardType } = this.props;
    return (
      <div id="settings-container">
        <label htmlFor="session-length">
          Work session length
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
          Break length
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
          Reward
        </label>
        <select
          id="reward"
          onChange={this.handleInputChange}
          defaultValue={rewardType.toLowerCase()}
        >
          {
            enums.rewards.map((reward, idx) => (
              <option
                key={`reward-${reward}`}
                value={reward.toLowerCase()}
              >
                {reward}
              </option>
            ))
          }
        </select>

        <br />

        <input
          onClick={this.handleSubmit}
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
  rewardType: PropTypes.string,
};

export default Settings;
