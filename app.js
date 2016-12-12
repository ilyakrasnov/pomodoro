const Pomodoro = React.createClass({
  getInitialState: function(){
    return (
      {
        completed: 1,
      }
    )
  },
  handleUpdate: function(){
    this.setState( { completed: this.state.completed + 1});
  },
  render: function(){
    return (
      <div className='pomodoro'>
        <Countdown
          updateStats={this.handleUpdate}
        />
        <Accomplishment completed={this.state.completed}/>
      </div>
    )
  },
});

const Countdown = React.createClass({
  getInitialState: function() {
    return {
      remaining: 5,
      running: true,
    };
  },
  componentDidMount: function(){
    if (this.state.running) {
      setInterval(this.tick, 1000);
    } else {
    };
  },
  tick: function(){
    if (this.state.remaining === 0) {
      this.setState({ remaining: 5 });
      this.props.updateStats();
    } else {
        this.setState({ remaining: this.state.remaining -1 });
    };
  },
  render: function(){
    const s = this.state.remaining;
    return (
      <div className='ui centered card'>
        <div className='content centered'>
          <h1>{helpers.secondsToHuman(s)}</h1>
          <ButtonControls
            handlePauseClick={this.handlePauseClick}
          />
        </div>
      </div>
    )
  },
});

const ButtonControls = React.createClass({
  render: function(){
    return (
      <button
        className="ui compact icon button"
        onClick={this.props.handlePauseClick}
      >
        <i className="pause icon"></i>
      </button>
    )
  },
});

const Accomplishment = React.createClass({
  render: function(){
    return (
    <div className="ui centered statistics">
      <div className="statistic">
        <div className="value">
          {this.props.completed}
        </div>
        <div className="label">
          Pomodoros
        </div>
      </div>
    </div>
    )
  },
});

const TimerActionButton = React.createClass({
  render: function(){
    if (this.props.timerIsRunning) {
      return (
        <div
          className='ui bottom attached red basic button'
          onClick={this.props.onStopClick}
        >
        Stop
        </div>
        );
    } else {
      return (
        <div
          className='ui bottom attached green basic button'
          onClick={this.props.onStartClickk}
        >
        Start
        </div>
      );
    }
  },
});

ReactDOM.render(
  <Pomodoro />,
  document.getElementById('content')
);
