import React from 'react';
import ReactDom from 'react-dom';
import './App.css';
import Timer from './components/Timer.jsx';
import Modal from './components/Modal.jsx';
import Settings from './components/Settings.jsx';
import utils from '../../utils';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: utils.minsToMs(0.25),
      breakLength: utils.minsToMs(5),
      settingsModalIsShowing: false,
      timeRemaining: utils.minsToMs(0.25),
      inBreak: false,
      intervalId: 0,
      isStopped: true,
      rewardType: 'cartoon',
    };
    this.toggleSettingsModal = this.toggleSettingsModal.bind(this);
    this.handleSettingsUpdate = this.handleSettingsUpdate.bind(this);
    this.toggleStopped = this.toggleStopped.bind(this);
    this.updateTimeRemaining = this.updateTimeRemaining.bind(this);
    this.toggleInBreak = this.toggleInBreak.bind(this);
  }

  handleSettingsUpdate(sessionLength, breakLength, rewardType) {
    // update state & close modal
    const { inBreak } = this.state;
    const timeRemaining = inBreak ? breakLength : sessionLength;
    this.setState({
      sessionLength, breakLength, timeRemaining, rewardType, settingsModalIsShowing: false,
    });
    // send settings to database matched w/ sessionId
  }

  toggleSettingsModal() {
    const { settingsModalIsShowing } = this.state;
    this.setState({ settingsModalIsShowing: !settingsModalIsShowing });
  }

  toggleInBreak() {
    const { inBreak } = this.state;
    const { sessionLength, breakLength } = this.state;
    const timeRemaining = inBreak ? sessionLength : breakLength;
    this.setState({ inBreak: !inBreak, timeRemaining });
    this.toggleStopped();
  }

  updateTimeRemaining() {
    const { timeRemaining, intervalId, rewardType } = this.state;
    if (timeRemaining <= 0) {
      this.toggleInBreak();
      clearInterval(intervalId);
      // TODO: show modal with joke/cartoon
    } else {
      this.setState({ timeRemaining: timeRemaining - utils.secsToMS(1) });
    }
  }

  toggleStopped() {
    const { isStopped } = this.state;
    let { intervalId } = this.state;
    this.setState({ isStopped: !isStopped });
    if (isStopped) {
      intervalId = setInterval(this.updateTimeRemaining, 1000);
      this.setState({ intervalId });
    } else {
      clearInterval(intervalId);
    }
  }

  render() {
    const {
      sessionLength, breakLength, settingsModalIsShowing,
      inBreak, timeRemaining, isStopped, rewardType,
    } = this.state;
    return (
      <div>
        <h1>Tomato clock</h1>
        <Timer
          sessionLength={sessionLength}
          breakLength={breakLength}
          inBreak={inBreak}
          isStopped={isStopped}
          timeRemaining={timeRemaining}
          toggleStopped={this.toggleStopped}
        />
        <button disabled={!isStopped} type="button" onClick={this.toggleSettingsModal}>settings</button>
        <Modal
          isShowing={settingsModalIsShowing}
          onClose={this.toggleSettingsModal}
          title="Settings"
        >
          <Settings
            sessionLength={sessionLength}
            breakLength={breakLength}
            rewardType={rewardType}
            handleSettingsUpdate={this.handleSettingsUpdate}
          />
        </Modal>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
