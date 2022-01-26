import React from 'react';
import ReactDom from 'react-dom';
import './App.css';
import Timer from './components/Timer.jsx';
import Modal from './components/Modal.jsx';
import utils from '../../utils';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: utils.minsToMs(0.25),
      breakLength: utils.minsToMs(5),
      settingsModalIsShowing: false,
    };
    this.toggleSettingsModal = this.toggleSettingsModal.bind(this);
  }

  componentDidMount() {

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
          this is a test
        </Modal>
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
