var PersistentGrid = require('../sockets/persistentGrid');
var persistentGrid = [];

function getIndex(name){
  var index;

  for (var i = 0; i < persistentGrid.length; i++){
    if(persistentGrid[i].getOwner() === name){
      index = i;
    }
  }

  return index;
}

module.exports = function(io){

  io.on('connection', function(socket){
    socket.on('initGrid', function(gridSize, name){
      var index = getIndex(name);

      if(index === undefined){
        index = persistentGrid.push(new PersistentGrid()) - 1;
        console.log(name + " not found! Creating new Grid for " + name + " at index " + index);
      }
      else{
        console.log(name + " already exists! Fetching grid for " + name + " at index " + index);
      }

      var result = persistentGrid[index].init(gridSize, name);
      var vol = persistentGrid[index].getVolume();

      var msg = {
        type: "initResponse",
        owner: name,
        data: result,
        volume: vol
      };

      socket.emit('response', msg);

    });

    socket.on('toggleNote', function(x, y, name){
      var index = getIndex(name);

      persistentGrid[index].toggleNote(x, y);
      console.log("Grid " + name + ", Toggle Note: X = " + x + ", Y = " + y);

      var msg = {
        type: "toggleNote",
        owner: name,
        xval: x,
        yval: y
      };

      socket.broadcast.emit('response', msg);
    });

    socket.on('toggleNoteSeries', function(arr, name){
      var x, y;
      var index = getIndex(name);

      for(var i = 0; i < arr.length; i+=2)
      {
        x = arr[i];
        y = arr[i + 1];

        persistentGrid[index].toggleNote(x, y);
        console.log("Grid " + name + ", Toggle Note: X = " + x + ", Y = " + y);
      }

      var msg = {
        type: "toggleNoteSeries",
        owner: name,
        data: arr
      };

      socket.broadcast.emit('response', msg);
    });

    socket.on('toggleRow', function(y, name){
      var index = getIndex(name);

      persistentGrid[index].toggleRow(y);
      console.log("Grid " + name + ", Toggle Row: Y = " + y);

      var msg = {
        type: "toggleRow",
        owner: name,
        yval: y
      };

      socket.broadcast.emit('response', msg);
    });

    socket.on('changeVolume', function(v, name){
      var index = getIndex(name);
      var vol = persistentGrid[index].setVolume(v);
      console.log("Grid " + name + ", Changing Volume to: " + v);

      var msg = {
        type: "changeVolume",
        owner: name,
        volume: vol
      };

      socket.broadcast.emit('response', msg);
    });

    socket.on('clearAll', function(name){
      var index = getIndex(name);
      persistentGrid[index].clearAll();
      console.log("Grid " + name + ", Clear All");

      var msg = {
        type: "clearAll",
        owner: name
      };

      socket.broadcast.emit('response', msg);
    });
  });

};