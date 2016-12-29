const config = {
      apiKey: "AIzaSyDdK5JW9ZrwiHnzqUi0iczVD1-4g9SNhMs",
      authDomain: "pomodoro-cfd39.firebaseapp.com",
      databaseURL: "https://pomodoro-cfd39.firebaseio.com",
      storageBucket: "pomodoro-cfd39.appspot.com",
      messagingSenderId: "754390314400"
    };
firebase.initializeApp(config);

const DEFAULT_TIME = 25 * 60;

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
                appId={this.state.appId}
              />
              <Stats completedToday={this.state.completedToday}/>
            </div>

          </div>
          <div className="ten wide column">
            <Todos appId={this.state.appId}/>
          </div>
        </div>
      </div>

    )
  },
});

const Countdown = React.createClass({
  getInitialState: function() {
    return {
      remaining: DEFAULT_TIME,
      defaultDuration: DEFAULT_TIME,
      running: false,
      settingsOn: false,
    };
  },
  updateFirebase: function(newDuration) {
    firebase.database().ref('pomodoros/'+this.props.appId+'/defaults').set(newDuration * 60);
  },
  fetchOrSetDurationFromFirebase:  function (){
    let defaultDuration;
    firebase.database().ref('pomodoros/'+this.props.appId+'/defaults').on('value', snapshot => {
      if (snapshot.val() != null) {
        defaultDuration = snapshot.val();
      } else {
        defaultDuration = DEFAULT_TIME;
      };
      this.setState({defaultDuration: defaultDuration, remaining: defaultDuration});
      this.updateFirebase();
    });
  },
  componentDidMount: function(){
    this.fetchOrSetDurationFromFirebase();
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
      this.setState({ remaining: this.state.defaultDuration, running: false });
      this.props.updateStats();
    } else {
        this.setState({ remaining: this.state.remaining -1 });
    };
  },

  handlePauseClick: function(){
    this.setState({ running: !this.state.running });
  },
  handleSettingsClick: function() {
    this.setState({ settingsOn: true });
  },
  handleSettingsSave: function(newDuration){
    this.setState({ settingsOn: false, defaultDuration: newDuration });
    this.updateFirebase(newDuration);
  },
  render: function(){
    if (this.state.settingsOn) {
      return (
          <div className="ui  card">
            <PomodoroSettings
              handleSettingsSave={this.handleSettingsSave}
              defaultDuration={this.state.defaultDuration / 60}/>
          </div>
      )
    } else {
        const sec = this.state.remaining;
        return (
          <div className="ui  card">
            <div className="content">
              <i
                className="right floated setting icon"
                style={{color:'#808080'}}
                onClick={this.handleSettingsClick}
              ></i>
              <div className="header">Pomodoro #{this.props.currentPomodoro}</div>
            </div>
            <div className="content">
              <div className="description">
                <h1>{helpers.secondsToHuman(sec)}</h1>
              </div>
            </div>
            <ButtonControls
              handlePauseClick={this.handlePauseClick}
              running={this.state.running}
            />
          </div>
        )
    }
  },
});

const PomodoroSettings = React.createClass({
  getInitialState: function(){
    return ({
      newDuration: null,
      defaultDuration: this.props.defaultDuration,
    });
  },
  componentDidUpdate: function(){
    this.refs.defaultDuration.focus();
  },
  handleSettingsSave: function(){
    let duration = this.state.newDuration || this.state.defaultDuration;
    this.props.handleSettingsSave(duration);
  },
  handleSettingInput: function(evt){
    this.setState({ newDuration: evt.target.value});
  },
  handleKeyPress: function(evt){
    if (evt.charCode === 13) {
      this.handleSettingsSave();
    }
  },
  render: function(){
    return (
          <div className="ui  card">
            <div className="content">
              <div className="header">Settings</div>
              </div>
            <div className="content">
              <div className="description">
                <div className="ui form">
                  <div className="inline fields">
                    <div className="sixteen wide field">
                      <label>Duration:</label>
                      <input
                        type="text"
                        placeholder="in minutes"
                        defaultValue={this.state.defaultDuration}
                        onChange={this.handleSettingInput}
                        onKeyPress={this.handleKeyPress}
                        ref="defaultDuration"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="ui bottom attached button"
              onClick={this.handleSettingsSave}
            >Save
            </div>
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
  fetchOrSetFirebase: function(){
    let todos;
    firebase.database().ref('pomodoros/'+this.props.appId+'/todos').on('value', snapshot => {
      if (snapshot.val() != null) {
        todos = snapshot.val();
      } else {
        todos = [];
      };
      this.setState({todos: todos});
      this.updateFirebase();
    });
  },
  getInitialState: function (){
    return (
        {
      todos: [ ]
    })
  },
  componentDidMount: function() {
    this.fetchOrSetFirebase();
  },
  componentDidUpdate: function(){
    this.updateFirebase();
  },
  updateFirebase: function() {
    firebase.database().ref('pomodoros/'+this.props.appId+'/todos').set(this.state.todos)
  },
  handleNewTodoSubmit: function(newTodo){
    this.setState( { todos: [...this.state.todos, newTodo]})
  },
  handleDeleteItem: function(todoId){
    let todos = this.state.todos.filter((todo) => {
      return todo.id !== todoId;
    })

    this.setState({ todos: todos });
  },
  deleteCompleted: function(){
    let todos = this.state.todos.filter((todo) => {
      return todo.completed === false;
    })

    this.setState({ todos: todos });
  },
  toggleCompleteItem: function(todoId){
    let todos = this.state.todos.map((todo) => {
      if (todo.id === todoId) {
        Object.assign(todo, { completed: !todo.completed });
        return todo;
      } else {
        return todo;
      };
    })
    this.setState({ todos: todos });
  },
  render: function(){
    return (
      <div>
        <NewTodo handleNewTodoSubmit={this.handleNewTodoSubmit}/>
        <TodoList
          todos={this.state.todos}
          handleDeleteItem={this.handleDeleteItem}
          toggleCompleteItem={this.toggleCompleteItem}

        />
        <DeleteCompleted
          nrOfTodos={this.state.todos.length}
          deleteCompleted={this.deleteCompleted}
        />
      </div>
    )
  },
});

const DeleteCompleted = React.createClass({
  render: function(){
    if (this.props.nrOfTodos > 0) {
      return (
        <a onClick={this.props.deleteCompleted}>Delete completed</a>
      )
    } else {
      return (
        <div></div>
      )
    };
  },
});

const TodoList = React.createClass({
  render: function(){
    const todos = this.props.todos.map((todo) => {
      return (
        <Todo
          text={todo.text}
          completed={todo.completed}
          key={todo.id}
          id={todo.id}
          handleDeleteItem={this.props.handleDeleteItem}
          toggleCompleteItem={this.props.toggleCompleteItem}
        />
      );
    });
    return (
      <div className='todoList'>
          <div className="ui middle aligned divided list" style={{marginBottom:'15px'}}>
            {todos}
          </div>
      </div>
    )
  },
});

const Todo = React.createClass({
  handleDeleteItem: function(){
    this.props.handleDeleteItem(this.props.id);
  },
  toggleCompleteItem: function(){
    this.props.toggleCompleteItem(this.props.id);
  },
  render: function(){
    if (!this.props.completed) {
      return (
        <div className="item">
          <div className="right floated content">
            <i className="remove icon" style={{color:'gray'}}
              onClick={this.handleDeleteItem}
            ></i>
          </div>
          <div
            className="left floated content"
            onClick={this.toggleCompleteItem}
          >
            <i className="square outline icon" style={{color:'gray'}}></i>
          </div>
          <div
            className="content"
            onClick={this.toggleCompleteItem}
          >
            {this.props.text}
          </div>
        </div>
      )
    } else {
      return (
        <div className="item">
          <div className="right floated content">
            <i className="remove icon" style={{color:'gray'}}
              onClick={this.handleDeleteItem}
            ></i>
          </div>
          <div className="left floated content">
            <i className="checkmark box icon" style={{color:'gray'}}
              onClick={this.toggleCompleteItem}
            ></i>
          </div>
          <div className="content" style={{ color: 'gray', textDecoration: 'line-through'}}
            onClick={this.toggleCompleteItem}
          >
            {this.props.text}
          </div>
        </div>
        )
    };
  },
});

const NewTodo = React.createClass({
  getInitialState: function(){
    return (
      { newTodo: { text: "", completed: false, id: uuid.v1() }  }
    )
  },
  handleChange: function(evt){
    this.setState({ newTodo: {text: evt.target.value, completed: false, id: this.state.newTodo.id } });
  },
  handleNewTodoSubmit: function(evt){
    evt.preventDefault();
    if (this.state.newTodo.text === '') {
      return
    } else {
      let id = uuid.v1();
      this.setState({ newTodo: {text: this.state.newTodo.text, completed: this.state.newTodo.completed, id: this.state.newTodo.id } });
      this.props.handleNewTodoSubmit(this.state.newTodo);
      this.refs.newTodo.value = '';
      this.setState({ newTodo: {text: '', completed: false, id: uuid.v1() } });
    };
  },
  render: function(){
    return (
      <div className='newTodo'>
        <form
          className="ui form"
          onSubmit={this.handleNewTodoSubmit}
        >
          <div className="fields">
            <div className="sixteen wide field">
              <input
                type="text"
                ref="newTodo"
                placeholder="Add todo"
                onChange={this.handleChange}
              />
            </div>
            <div className="field">
              <button style={{display: 'none'}} className="ui button" type="submit">Add</button>
            </div>
          </div>
        </form>
      </div>
    )
  },
});

ReactDOM.render(
  <Pomodoro />,
  document.getElementById('content')
);



