const Pomodoro = React.createClass({
  fetchCompleted: function(){
    let completed = JSON.parse(localStorage.getItem('completedPomodoros')) || 0;
    if (completed === 0) { localStorage.setItem('completedPomodoros', 0)};
    return completed;
  },
  updateStorage: function(){
    localStorage.setItem('completedPomodoros', this.state.completed)
  },
  getInitialState: function(){
    return (
      {
        completed: this.fetchCompleted(),
      }
    )
  },
  handleUpdate: function(){
    let new_count = this.state.completed + 1;

    this.setState( { completed: new_count});
    this.updateStorage();
  },
  render: function(){
    return (
      <div className='pomodoro'>
        <Countdown
          updateStats={this.handleUpdate}
          currentPomodoro={this.state.completed + 1}
        />
        <Stats completed={this.state.completed}/>
      </div>
    )
  },
});

const Countdown = React.createClass({
  getInitialState: function() {
    return {
      remaining: 5,
      running: false,
    };
  },
  componentDidMount: function(){
    if (this.state.running) {
      this.tickInterval = setInterval(this.tick, 1000);
    };
  },
  componentDidUpdate: function(){
    if (!this.state.running) {
      clearInterval(this.tickInterval, 1000);
    } else {
      clearInterval(this.tickInterval, 1000);
      this.tickInterval = setInterval(this.tick, 1000);
    };
    document.title=helpers.secondsToHuman(this.state.remaining);
  },
  tick: function(){
    if (this.state.remaining === 0) {
      alert("Finished");
      this.setState({ remaining: 5, running: false });
      this.props.updateStats();
    } else {
        this.setState({ remaining: this.state.remaining -1 });
    };
  },

  handlePauseClick: function(){
    this.setState({ running: !this.state.running });
  },
  render: function(){
    const s = this.state.remaining;
    return (
      <div className="ui  centered card">
        <div className="content">
          <div className="header">Pomodoro #{this.props.currentPomodoro}</div>
          <div className="description">
            <h1>{helpers.secondsToHuman(s)}</h1>
          </div>
        </div>
        <ButtonControls
          handlePauseClick={this.handlePauseClick}
          running={this.state.running}
        />

      </div>
    )
  },
});

const ButtonControls = React.createClass({
  render: function(){
    if (this.props.running){
      return (
        <div
          className="ui bottom attached negative button"
          onClick={this.props.handlePauseClick}
        >
          <i className="pause icon"></i>
        </div>
      )
    } else {
      return (
        <div
          className="ui bottom attached positive button"
          onClick={this.props.handlePauseClick}
        >
          <i className="play icon"></i>
        </div>
      )
    }
  },
});

const Stats = React.createClass({
  render: function(){
    return (
      <div className="ui  centered card">
        <div className="content">
          <div className="description">

            <div className="ui horizontal statistic">
              <div className="value">
                {this.props.completed}
              </div>
              <div className="label">
                pomodoros today
              </div>
            </div>

          </div>
        </div>
      </div>

    )
  },
});


ReactDOM.render(
  <Pomodoro />,
  document.getElementById('content')
);
