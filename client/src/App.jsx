import React from 'react';
import ReactDom from 'react-dom';
import axios from 'axios';
import './App.css';
import Timer from './components/Timer.jsx';
import Modal from './components/Modal.jsx';
import Settings from './components/Settings.jsx';
import utils from '../../utils';
import enums from '../../enums';
import SVGs from './assets/SVGs.jsx';

const DEFAULT_BREAK = Math.ceil(utils.minsToMs(2));
const DEFAULT_SESSION = Math.ceil(utils.minsToMs(25));
const DEFAULT_REWARD = enums.rewards[0].toLowerCase();

/*
TODO:
1. sound at time elapsed
2. Carousel of tomatoes (green break, red work)
*/

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
    axios.get('/db/settings')
      .then((response) => {
        if (response.data === null) throw new Error('No settings saved for user.');
        const { breakLength, sessionLength, rewardType } = response.data;
        this.setState({
          breakLength,
          sessionLength,
          rewardType,
          timeRemaining: sessionLength,
        });
      })
      .catch(() => {
        this.setState({
          breakLength: DEFAULT_BREAK,
          sessionLength: DEFAULT_SESSION,
          rewardType: DEFAULT_REWARD,
          timeRemaining: DEFAULT_SESSION,
        });
      })
      .then(() => {
        const { rewardType } = this.state;
        this.updateRewardContent(rewardType);
      });
  }

  handleSettingsUpdate(updatedSessionLength, updatedBreakLength, updatedRewardType) {
    // update state & close modal
    const { inBreak, rewardType, rewardContent } = this.state;
    const timeRemaining = inBreak ? updatedBreakLength : updatedSessionLength;
    this.setState({
      sessionLength: updatedSessionLength,
      breakLength: updatedBreakLength,
      timeRemaining,
      rewardType: updatedRewardType,
      settingsModalIsShowing: false,
    });
    // TODO: update if condition
    if (true || rewardType !== updatedRewardType || rewardContent.type !== updatedRewardType) {
      this.updateRewardContent(updatedRewardType);
    }
    const payload = {
      breakLength: updatedBreakLength,
      sessionLength: updatedSessionLength,
      rewardType: updatedRewardType,
    };
    axios.post('/db/settings', payload);
  }

  updateRewardContent(updatedRewardType) {
    updatedRewardType = updatedRewardType || DEFAULT_REWARD;
    // keep random first
    if (updatedRewardType === 'random') {
      const possibleRewards = enums.rewards.length;
      updatedRewardType = enums.rewards[Math.floor((possibleRewards - 1)
        * Math.random()) + 1].toLowerCase();
    }
    if (updatedRewardType === 'dog photos') {
      const url = '/api/dogapi';
      axios.get(url)
        .then((response) => {
          const rewardContent = utils.generateImage(response.data.message);
          this.setState({ rewardContent });
        });
    }

    if (updatedRewardType === 'cat photos') {
      const url = '/api/catapi';
      axios.get(url)
        .then((response) => {
          const rewardContent = utils.generateImage(response.data[0].url);
          this.setState({ rewardContent });
        });
    }
    if (updatedRewardType === 'xkcd comic') {
      const comicNumber = Math.floor(Math.random() * 2572);
      const url = `/api/xkcd/${comicNumber}`;
      axios.get(url)
        .then((response) => {
          const rewardContent = utils.generateImage(response.data);
          this.setState({ rewardContent });
        });
    }
    if (updatedRewardType === 'programming memes') {
      const url = '/api/programming-memes';
      axios.get(url)
        .then((response) => {
          const idx = Math.floor(Math.random() * response.data.length);
          const rewardContent = utils.generateImage(response.data[idx].image);
          this.setState({ rewardContent });
        });
    }
  }

  toggleSettingsModal() {
    const { settingsModalIsShowing } = this.state;
    this.setState({ settingsModalIsShowing: !settingsModalIsShowing });
  }

  toggleRewardModal() {
    const { rewardModalIsShowing, inBreak } = this.state;
    if (!inBreak) return;
    this.setState({ rewardModalIsShowing: !rewardModalIsShowing });
    if (rewardModalIsShowing) this.updateRewardContent();
  }

  toggleInBreak() {
    const { inBreak, sessionLength, breakLength } = this.state;
    const timeRemaining = inBreak ? sessionLength : breakLength;
    this.setState({ inBreak: !inBreak, timeRemaining });
  }

  updateTimeRemaining() {
    const { timeRemaining } = this.state;
    document.title = utils.MSToMinutesAndSeconds(timeRemaining);
    if (timeRemaining >= 1) {
      this.setState({ timeRemaining: (timeRemaining - utils.secsToMS(1)) });
    } else {
      this.toggleInBreak();
      this.toggleStopped();
      this.toggleRewardModal();
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
      <div id="app-container">
        <div id="nav-bar">
          <h1>Tomato clock</h1>
          <button
            style={{ minHeight: '30px' }}
            name="settings"
            disabled={!isStopped}
            type="button"
            onClick={this.toggleSettingsModal}>
            {SVGs.settings()}
          </button>
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
          title={'🎉 A reward for your hard work 🎉'}
        >
          <div style={{ display: 'flex', justifyConent: 'center' }}>
            <img
              style={{ maxWidth: '100%' }}
              src={rewardContent.src}
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
