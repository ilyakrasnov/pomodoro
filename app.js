const config = {
      apiKey: "AIzaSyDdK5JW9ZrwiHnzqUi0iczVD1-4g9SNhMs",
      authDomain: "pomodoro-cfd39.firebaseapp.com",
      databaseURL: "https://pomodoro-cfd39.firebaseio.com",
      storageBucket: "pomodoro-cfd39.appspot.com",
      messagingSenderId: "754390314400"
    };
firebase.initializeApp(config);

const Pomodoro = React.createClass({
  getInitialState: function(){
    return (
      {
        completedToday: 0,
        appId: helpers.fetchOrNewUuid(),
      }
    )
  },
  componentDidMount: function(){
    this.fetchOrSetFirebase();
  },
  updateStorage: function(){
    helpers.setFireBase(this.state.appId, helpers.todaysDate(), {
      completed: this.state.completedToday,
    });
  },
  fetchOrSetFirebase: function(){
    let comp;
    firebase.database().ref('pomodoros/'+this.state.appId+'/'+helpers.todaysDate()).on('value', snapshot => {
      if (snapshot.val() != null) {
        comp = snapshot.val().completed;
      } else {
        comp = 0;
      };
      this.setState({completedToday: comp});
    });
  },
  handleUpdate: function(){
    this.setState( { completedToday: this.state.completedToday + 1 });
    this.updateStorage();
  },
  render: function(){
    return (
      <div className='pomodoro'>
        <Countdown
          updateStats={this.handleUpdate}
          currentPomodoro={this.state.completedToday + 1}
        />
        <Stats completedToday={this.state.completedToday}/>
      </div>
    )
  },
});

const Countdown = React.createClass({
  getInitialState: function() {
    return {
      remaining: 2,
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
      this.setState({ remaining: 2, running: false });
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
                {this.props.completedToday}
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
