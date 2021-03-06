var PersistentGrid = require('../sockets/persistentGrid');
var persistentGrid = [];
var usedInstruments = [];
var usedNames = [];

//Search the grids for the index of the clients grid
function getIndex(name){
  var index;

  for (var i = 0; i < persistentGrid.length; i++){
    if(persistentGrid[i].getOwner() === name){
      index = i;
    }
  }

  return index;
}

function checkInstrument(instrument){
  var index;

  for (var i = 0; i < usedInstruments.length; i++){
    if(usedInstruments[i] === instrument){
      index = i;
    }
  }

  return index;
}

module.exports = function(io){

  io.on('connection', function(socket){

    //Check if the connecting client has a grid associated with it
    socket.on('initGrid', function(gridSize, clientName, instrument){
      var instrumentIndex = checkInstrument(instrument);

      if(instrumentIndex === undefined){
        usedInstruments.push(instrument);
        console.log(instrument + " has been added!");
      }
      else
      {
        console.log(instrument + " is already in use!");
      }

      var index = getIndex(clientName);

      //If the client doesn't own a grid, create one for the client. Else retrieve the state of the client's grid
      if(index === undefined){
        index = persistentGrid.push(new PersistentGrid()) - 1;
        usedNames.push(clientName);
        console.log(clientName + " not found! Creating new Grid for " + clientName + " at index " + index);
      }
      else{
        console.log(clientName + " already registered. Fetching grid for " + clientName + " at index " + index);
      }

      var result = persistentGrid[index].init(gridSize, clientName, instrument);
      var vol = persistentGrid[index].getVolume();

      var msg = {
        type: "initResponse",
        owner: clientName,
        data: result,
        volume: vol
      };

      socket.emit('response', msg);

      if(result === null){
        msg = {
          type: "newUserJoined",
          owner: clientName
        };

        socket.broadcast.emit('response', msg);
      }
    });

    //Fetches all the remote grids for the requesting client
    socket.on('getRemoteGrids', function(name){
      var index = getIndex(name);
      var result = [];

      for(var i = 0; i < persistentGrid.length; i++){
        if(persistentGrid[i].getOwner() !== name){
          var remote = {
            name: persistentGrid[i].getOwner(),
            type: persistentGrid[i].getType(),
            grid: persistentGrid[i].getGrid(),
            vol: persistentGrid[i].getVolume()
          };

          result.push(remote);
        }
      }

      var msg = {
        type: "getRemoteGrids",
        owner: name,
        data: result
      };

      socket.emit('response', msg);
    });

    socket.on('logout', function(name){
      var index = getIndex(name);
      var instrument = persistentGrid[index].getType();
      var instrumentIndex = checkInstrument(instrument);
      var nameIndex = usedNames.indexOf(name);

      console.log("Logging out: " + name + "'s grid is at index " + index + " and is of type " + instrument);

      persistentGrid.splice(index, 1);
      usedInstruments.splice(instrumentIndex, 1);
      usedNames.splice(nameIndex, 1);

      var msg = {
        type: "userLoggedOut",
        owner: name
      };

      socket.broadcast.emit('response', msg);

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

    socket.on('gridsLoaded', function(name){
      var msg = {
        type: "gridsLoaded",
        owner: name,
        data: persistentGrid.length
      };

      socket.emit('response', msg);
    });
  });

};

module.exports.usedArrs = {
  instruments: usedInstruments,
  names: usedNames
};