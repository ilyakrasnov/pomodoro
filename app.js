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
  ringTheBell: function() {
    document.getElementById("audio").play();
  },
  render: function(){
    return (

      <div className="ui grid">
        <div className="three column row">
          <div className="column">

            <div className='pomodoro'>
              <Countdown
                updateStats={this.handleUpdate}
                currentPomodoro={this.state.completedToday + 1}
                ringTheBell={this.ringTheBell}
              />
              <Stats completedToday={this.state.completedToday}/>
            </div>

          </div>
          <div className="ten wide column">
            <Todos />
          </div>
        </div>
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
      this.props.ringTheBell();
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
      <div className="ui  card">
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
      <div className="ui  card">
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

const Todos = React.createClass({
  getInitialState: function (){
    return (
        {
      todos: [
        {
          text: "Learn React",
          completed: false
        },
        {
          text: "Learn Angular",
          completed: false
        },
        {
          text: "Work on OAMP",
          completed: false
        },
        {
          text: "Email Yaakov",
          completed: false
        },
        {
          text: "Listen to Kafka",
          completed: false
        },
      ]
    })
  },
  handleNewTodoSubmit: function(newTodo){
    this.setState( { todos: [...this.state.todos, newTodo]})
  },
  render: function(){
    return (
        <div>
          <NewTodo handleNewTodoSubmit={this.handleNewTodoSubmit}/>
          <TodoList todos={this.state.todos}/>
        </div>
    )
  },
});

const NewTodo = React.createClass({
  getInitialState: function(){
    return (
        { newTodo: { text: "", completed: false }  }
    )
  },
  handleChange: function(evt){
    this.setState({ newTodo: {text: evt.target.value } });
  },
  handleNewTodoSubmit: function(evt){
    evt.preventDefault();
    this.props.handleNewTodoSubmit(this.state.newTodo);
    console.log(evt.target);
  },
  render: function(){
    return (
      <div className='newTodo'>
        <form
          className="ui form"
          onSubmit={this.handleNewTodoSubmit}
        >
          <div className="fields">
            <div className="twelve wide field">
              <input
                type="text"
                name="new-todo"
                placeholder="Add todo"
                onChange={this.handleChange}
              />
            </div>
            <div className="one wide field">
              <button className="ui button" type="submit">Add</button>
            </div>
          </div>
        </form>
      </div>
    )
  },
});

const TodoList = React.createClass({
  render: function(){
    const todos = this.props.todos.map((todo) => {
      return (
        <Todo
          text={todo.text}
          completed={todo.completed}
          key={todo.text}
        />
      );
    });
    return (
      <div className='todoList'>
          <div className="ui middle aligned divided list">
            {todos}
          </div>
      </div>
    )
  },
});

const Todo = React.createClass({
  render: function(){
    return (
      <div className="item">
        <div className="right floated content">
          <i className="square outline icon large"></i>
        </div>
        <div className="content">
          {this.props.text}
        </div>
      </div>
    )
  },
});

ReactDOM.render(
  <Pomodoro />,
  document.getElementById('content')
);



