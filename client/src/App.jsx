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
function SETTINGS_ICON() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  );
}

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
      updatedRewardType = enums.rewards[Math.floor((possibleRewards - 1) * Math.random())];
    }
    if (updatedRewardType === 'dog photos') {
      const url = '/api/dogapi';
      axios.get(url)
        .then((response) => {
          const rewardContent = { type: updatedRewardType, img: response.data.message };
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
    const { rewardModalIsShowing, inBreak } = this.state;
    if (!inBreak) return;
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
      <div>
        <div id="nav-bar">
          <h1>Tomato clock</h1>
          <button disabled={!isStopped} type="button" onClick={this.toggleSettingsModal}>
            {SETTINGS_ICON()}
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
