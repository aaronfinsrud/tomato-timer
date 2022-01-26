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
      timeRemaining: 0,
    };
    this.toggleSettingsModal = this.toggleSettingsModal.bind(this);
    this.handleSettingsUpdate = this.handleSettingsUpdate.bind(this);
  }

  handleSettingsUpdate(sessionLength, breakLength) {
    // update state & close modal
    this.setState({ sessionLength, breakLength, settingsModalIsShowing: false });
    // update timeRemaining
    // send settings to database matched w/ sessionId
  }

  toggleSettingsModal() {
    const { settingsModalIsShowing } = this.state;
    this.setState({ settingsModalIsShowing: !settingsModalIsShowing });
  }

  render() {
    const { sessionLength, breakLength, settingsModalIsShowing } = this.state;
    return (
      <div>
        <h1>Tomato clock</h1>
        <Timer
          sessionLength={sessionLength}
          breakLength={breakLength}
        />
        <button type="button" onClick={this.toggleSettingsModal}>settings</button>
        <Modal
          isShowing={settingsModalIsShowing}
          onClose={this.toggleSettingsModal}
          title="Settings"
        >
          <Settings
            sessionLength={sessionLength}
            breakLength={breakLength}
            handleSettingsUpdate={this.handleSettingsUpdate}
          />
        </Modal>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
