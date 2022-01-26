import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import './App.css';
import Timer from './components/Timer.jsx';
import Modal from './components/Modal.jsx';
import Settings from './components/Settings.jsx';
import utils from '../../utils';
import enums from '../../enums';

const DEFAULT_BREAK = Math.ceil(utils.minsToMs(2));
const DEFAULT_SESSION = Math.ceil(utils.minsToMs(25));
const DEFAULT_REWARD = enums.rewards[0].toLowerCase();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: DEFAULT_SESSION,
      breakLength: DEFAULT_BREAK,
      settingsModalIsShowing: false,
      rewardModalIsShowing: false,
      timeRemaining: DEFAULT_SESSION,
      inBreak: false,
      intervalId: 0,
      isStopped: true,
      rewardType: DEFAULT_REWARD,
      rewardContent: '',
    };
    this.toggleSettingsModal = this.toggleSettingsModal.bind(this);
    this.handleSettingsUpdate = this.handleSettingsUpdate.bind(this);
    this.toggleStopped = this.toggleStopped.bind(this);
    this.updateTimeRemaining = this.updateTimeRemaining.bind(this);
    this.toggleInBreak = this.toggleInBreak.bind(this);
    this.toggleRewardModal = this.toggleRewardModal.bind(this);
    this.updateRewardContent = this.updateRewardContent.bind(this);
  }

  componentDidMount() {
    this.updateRewardContent();
    axios.get('/db/settings')
      .then((response) => {
        const { breakLength, sessionLength, rewardType } = response.data;
        this.setState({
          breakLength: breakLength || DEFAULT_BREAK,
          sessionLength: sessionLength || DEFAULT_SESSION,
          rewardType: rewardType || DEFAULT_REWARD,
          timeRemaining: sessionLength || DEFAULT_SESSION,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  handleSettingsUpdate(updatedSessionLength, updatedBreakLength, updatedRewardType) {
    // update state & close modal
    const { inBreak, rewardType } = this.state;
    const timeRemaining = inBreak ? updatedBreakLength : updatedSessionLength;
    this.setState({
      sessionLength: updatedSessionLength,
      breakLength: updatedBreakLength,
      timeRemaining,
      rewardType: updatedRewardType,
      settingsModalIsShowing: false,
    });
    if (rewardType !== updatedRewardType) this.updateRewardContent(updatedRewardType);
    // TODO: send settings to database matched w/ sessionId
    const payload = {
      breakLength: updatedBreakLength,
      sessionLength: updatedSessionLength,
      rewardType: updatedRewardType,
    };
    axios.post('/db/settings', payload);
  }

  updateRewardContent(updatedRewardType) {
    // keep random first
    if (updatedRewardType === 'random') {
      const possibleRewards = enums.rewards.length;
      updatedRewardType = enums.rewards[Math.floor((possibleRewards - 1) * Math.random())];
    }
    if (updatedRewardType === 'dog photos') {
      const url = '/api/dogapi';
      axios.get(url)
        .then((response) => {
          const rewardContent = { img: response.data.message };
          this.setState({ rewardContent });
        });
    }

    if (updatedRewardType === 'cat photos') {
      const url = '/api/catapi';
      axios.get(url)
        .then((response) => {
          const rewardContent = { img: response.data[0].url };
          this.setState({ rewardContent });
        });
    }
    if (updatedRewardType === 'xkcd comic') {
      const comicNumber = Math.floor(Math.random() * 2572);
      const url = `/api/xkcd/${comicNumber}`;
      axios.get(url)
        .then((response) => {
          this.setState({ rewardContent: response.data });
        });
    }
    if (updatedRewardType === 'programming memes') {
      const url = '/api/programming-memes';
      axios.get(url)
        .then((response) => {
          const idx = Math.floor(Math.random() * response.data.length);
          const rewardContent = { img: response.data[idx].image };
          this.setState({ rewardContent });
        });
    }
  }

  toggleSettingsModal() {
    const { settingsModalIsShowing } = this.state;
    this.setState({ settingsModalIsShowing: !settingsModalIsShowing });
  }

  toggleRewardModal() {
    const { rewardModalIsShowing } = this.state;
    this.setState({ rewardModalIsShowing: !rewardModalIsShowing });
    this.updateRewardContent();
  }

  toggleInBreak() {
    const { inBreak, sessionLength, breakLength } = this.state;
    const timeRemaining = inBreak ? sessionLength : breakLength;
    this.setState({ inBreak: !inBreak, timeRemaining });
  }

  updateTimeRemaining() {
    const { timeRemaining } = this.state;
    if (timeRemaining >= 1) {
      this.setState({ timeRemaining: (timeRemaining - utils.secsToMS(1)) });
    } else {
      this.toggleInBreak();
      this.toggleStopped();
      this.setState({ rewardModalIsShowing: true });
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
      inBreak, timeRemaining, isStopped, rewardType, rewardContent,
    } = this.state;
    return (
      <div>
        <div id="nav-bar">
          <h1>Tomato clock</h1>
          <button disabled={!isStopped} type="button" onClick={this.toggleSettingsModal}>settings</button>
        </div>
        <Timer
          sessionLength={sessionLength}
          breakLength={breakLength}
          inBreak={inBreak}
          isStopped={isStopped}
          timeRemaining={timeRemaining}
          toggleStopped={this.toggleStopped}
        />
        {/* REWARD MODAL */}
        <Modal
          isShowing={rewardModalIsShowing}
          onClose={this.toggleRewardModal}
          title={rewardType}
        >
          <div style={{ display: 'flex', justifyConent: 'center' }}>
            <img
              style={{ maxWidth: '100%' }}
              src={rewardContent.img}
              alt=""
            />
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
