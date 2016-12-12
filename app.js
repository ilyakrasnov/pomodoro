const Pomodoro = React.createClass({
  fetchCompleted: function(){
    let today = helpers.todaysDate();
    let completed = JSON.parse(localStorage.getItem('completedPomodoros'[today])) || 0;
    if (completed === 0) { localStorage.setItem('completedPomodoros'[today], 0)};
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
      <div className='ui centered card'>
        <div className='content centered'>
          <h1>{helpers.secondsToHuman(s)}</h1>
          <ButtonControls
            handlePauseClick={this.handlePauseClick}
            running={this.state.running}
          />
        </div>
      </div>
    )
  },
});

const ButtonControls = React.createClass({
  render: function(){
    if (this.props.running){
      return (
        <button
          className="ui huge negative button"
          onClick={this.props.handlePauseClick}
        >
          <i className="pause icon"></i>
        </button>
      )
    } else {
      return (
        <button
          className="ui huge positive button"
          onClick={this.props.handlePauseClick}
        >
          <i className="play icon"></i>
        </button>
      )
    }
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
          Pomodoros today
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
