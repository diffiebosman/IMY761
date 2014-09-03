var timer = null;
var noteBuffer = [];

var ClientSocket = function(){
    var socket = io();

    //Inform the server of the size of the grid to be used
    // @param gridSize = size of Note Grid
    this.initGrid = function(gridSize){
        socket.emit('initGrid', gridSize);
    };

    // Send toggled notes to the server for broadcast, buffers the notes and sends after 200ms if no new notes are toggled
    // Buffering this may not be necessary, I'm not sure if it helps
    // @param x = x-coordinate on grid
	// @param y = y-coordinate on grid
    this.toggleNote = function(x, y){
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
                socket.emit('toggleNoteSeries', noteBuffer);
            }
            else{
                socket.emit('toggleNote', x, y);
            }
            noteBuffer = [];
        }, 200);
    };

    //Send toggled row of notes to the server for broadcast
	// @param y = y-coordinate on grid
    this.toggleRow = function(y){
        socket.emit('toggleRow', y);
    };

    //Sends adjusted volume to server once every 500 ms to avoid spamming the server with requests
    this.changeVolume = function(v){
        if(timer){
            window.clearTimeout(timer);
        }

        timer = window.setTimeout(function(){
            timer = null;
            socket.emit("changeVolume", v);
        }, 500);
    };

    //Send signal to clear the grid
    this.clearAll = function(){
        socket.emit('clearAll');
    };

    //Listener for server responses
    // @param synchronise = function in Grid to update the grid based on the type of server response
    this.listen = function(synchronise){
        socket.on('response', function(msg){
            //Pass the server response to the grid
            synchronise(msg);
        });
    };
};