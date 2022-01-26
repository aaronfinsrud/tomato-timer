import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import './App.css';
import Timer from './components/Timer.jsx';
import Modal from './components/Modal.jsx';
import Settings from './components/Settings.jsx';
import utils from '../../utils';

const DEFAULT_MIN = Math.ceil(utils.minsToMs(0.1));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: DEFAULT_MIN,
      breakLength: DEFAULT_MIN,
      settingsModalIsShowing: false,
      rewardModalIsShowing: false,
      timeRemaining: DEFAULT_MIN,
      inBreak: false,
      intervalId: 0,
      isStopped: true,
      rewardType: 'cartoon',
      reward: '',
    };
    this.toggleSettingsModal = this.toggleSettingsModal.bind(this);
    this.handleSettingsUpdate = this.handleSettingsUpdate.bind(this);
    this.toggleStopped = this.toggleStopped.bind(this);
    this.updateTimeRemaining = this.updateTimeRemaining.bind(this);
    this.toggleInBreak = this.toggleInBreak.bind(this);
    this.toggleRewardModal = this.toggleRewardModal.bind(this);
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

  toggleRewardModal() {
    const { rewardModalIsShowing } = this.state;
    this.setState({ rewardModalIsShowing: !rewardModalIsShowing });
  }

  toggleInBreak() {
    const { inBreak, sessionLength, breakLength } = this.state;
    const timeRemaining = inBreak ? sessionLength : breakLength;
    this.setState({ inBreak: !inBreak, timeRemaining });
  }

  updateTimeRemaining() {
    const { timeRemaining, rewardType } = this.state;
    if (timeRemaining >= 1) {
      console.log(timeRemaining);
      this.setState({ timeRemaining: (timeRemaining - utils.secsToMS(1)) });
    } else {
      this.toggleInBreak();
      this.toggleStopped();

      // TODO: show modal with joke/cartoon
      const comicNumber = Math.floor(Math.random() * 2572);
      const url = rewardType === 'cartoon' ? `/api/xkcd/${comicNumber}` : '';
      axios.get(url)
        .then((response) => {
          this.setState({ rewardModalIsShowing: true, reward: response.data });
        });
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
      sessionLength, breakLength, settingsModalIsShowing, rewardModalIsShowing,
      inBreak, timeRemaining, isStopped, rewardType, reward,
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

        {/* REWARD MODAL */}
        <Modal
          isShowing={rewardModalIsShowing}
          onClose={this.toggleRewardModal}
          title="Cartoon"
        >
          <div style={{ display: 'flex', justifyConent: 'center' }}>
            <img alt={reward.alt} src={reward.img} />
          </div>
        </Modal>

        {/* SETTINGS MODAL */}
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
