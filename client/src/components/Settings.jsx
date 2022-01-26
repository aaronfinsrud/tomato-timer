import React from 'react';
import PropTypes from 'prop-types';
import utils from '../../../utils';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedSessionLength: '',
      updatedBreakLength: '',
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
    if (id === 'break-length') {
      this.setState({ updatedBreakLength: value });
    }
    if (id === 'session-length') {
      this.setState({ updatedSessionLength: value });
    }
  }

  render() {
    const { updatedBreakLength, updatedSessionLength } = this.state;
    const { handleSettingsUpdate } = this.props;
    return (
      <div id="settings-container">
        <label htmlFor="session-length">
          Work session length
        </label>
        <input
          type="number"
          id="session-length"
          onChange={this.handleInputChange}
          value={updatedSessionLength}
        />
        <br />
        <label htmlFor="break-length">
          Break length
        </label>
        <input
          type="number"
          id="break-length"
          onChange={this.handleInputChange}
          value={updatedBreakLength}
        />
        <br />
        <input
          onClick={() => handleSettingsUpdate(utils.minsToMs(updatedSessionLength),
            utils.minsToMs(updatedBreakLength))}
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
