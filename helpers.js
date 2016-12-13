window.helpers = (function () {
  function secondsToHuman(s) {
    const seconds = Math.floor(s  % 60);
    const minutes = Math.floor((s / 60) % 60);

    const humanized = [
     pad(minutes.toString(), 2),
     pad(seconds.toString(), 2),
    ].join(':');

    return humanized;
  }

  function pad(numberString, size) {
    let padded = numberString;
    while (padded.length < size) padded = `0${padded}`;
    return padded;
  }

  function todaysDate(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();

    if(dd<10) {
          dd='0'+dd
    }

    if(mm<10) {
          mm='0'+mm
    }

    return dd+''+mm+''+yyyy;
  }

  function setFireBase(id, date, object) {
    firebase.database().ref('pomodoros/'+id+'/'+date).set(object);
  }

   function fetchOrNewUuid(){
    let id = localStorage.getItem('pomodoroId');
    if (!id) {
      id = uuid.v1();
      localStorage.setItem('pomodoroId', id);
    }
    return id;
  }

  return {
    secondsToHuman,
    todaysDate,
    setFireBase,
    fetchOrNewUuid
  };
}());
