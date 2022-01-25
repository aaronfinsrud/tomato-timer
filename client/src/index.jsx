import React from 'react';
import ReactDom from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    return (
      <div>
        Tomato clock
      </div>
    );
  }
}

ReactDom.render(<App />, document.getElementById('app'));
