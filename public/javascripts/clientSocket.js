var timer = null;
var noteBuffer = [];

var ClientSocket = function(){
    var socket = io();

    //Inform the server of the size of the grid to be used
    // @param gridSize = size of Note Grid
    this.signIn = function(gridSize, name){
        socket.emit('initGrid', gridSize, name);
    };

    //Returns the servers response to the log in request
    // @param name = the clientName of the client which is signing in
    this.signInResponse = function(setupFunc, name){
        socket.on('response', function(msg){
            if(msg.type == "initResponse" && msg.owner === name){
                setupFunc(msg, name);
            }
        });
    };

    this.getRemoteGrids = function(name){
        socket.emit('getRemoteGrids', name);
    };

    this.remoteGridResponse = function(setupFunc, name){
        socket.on('response', function(msg){
            if(msg.type == "getRemoteGrids" && msg.owner === name){
                setupFunc(msg);

                // I'm hoping that this will happen as soon as all the grids are set up, if not we're gonna have to implement
                // some sort of callback function
                socket.emit('gridsLoaded', name);
            }
        });
    };

    this.gridsLoadedResponse = function(setupFunc, name){
        socket.on('response', function(msg){
            if(msg.type == "gridsLoaded" && msg.owner === name){
                setupFunc(msg);
            }
        });
    };

    this.listenForNewUsers = function(name){
        socket.on('response', function(msg){
            if(msg.type == "newUserJoined" && msg.owner !== name){
                //setupFunc(msg);
                console.log(msg.owner + " has joined");
                socket.emit('getRemoteGrids', name);
            }
        });
    };

    // Send toggled notes to the server for broadcast, buffers the notes and sends after 200ms if no new notes are toggled
    // Buffering this may not be necessary, I'm not sure if it helps
    // @param x = x-coordinate on grid
	// @param y = y-coordinate on grid
    this.toggleNote = function(x, y, name){
        // Uncomment this line and comment out everything else to stop using the buffer
        //socket.emit('toggleNote', x, y);

        noteBuffer.push(x);
        noteBuffer.push(y);

        if(timer){
            window.clearTimeout(timer);
        }

        timer = window.setTimeout(function(){
            timer = null;

            if(noteBuffer.length > 2){
                socket.emit('toggleNoteSeries', noteBuffer, name);
            }
            else{
                socket.emit('toggleNote', x, y, name);
            }
            noteBuffer = [];
        }, 200);
    };

    //Send toggled row of notes to the server for broadcast
	// @param y = y-coordinate on grid
    this.toggleRow = function(y, name){
        socket.emit('toggleRow', y, name);
    };

    //Sends adjusted volume to server once every 500 ms to avoid spamming the server with requests
    this.changeVolume = function(v, name){
        if(timer){
            window.clearTimeout(timer);
        }

        timer = window.setTimeout(function(){
            timer = null;
            socket.emit("changeVolume", v, name);
        }, 500);
    };

    //Send signal to clear the grid
    this.clearAll = function(name){
        socket.emit('clearAll', name);
    };

    //Listener for server responses
    // @param synchronise = function in Grid to update the grid based on the type of server response
    this.listen = function(synchronise, name){
        socket.on('response', function(msg){
            //Delegates the server respnse to the specific grid to be processed
            if(msg.type !== "getRemoteGrids" && msg.owner === name){
                synchronise(msg);
            }
        });
    };
};