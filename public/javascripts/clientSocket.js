var ClientSocket = function(){
    var socket = io();

    //Inform the server of the size of the grid to be used
    // @param gridSize = size of Note Grid
    this.initGrid = function(gridSize){
        socket.emit('initGrid', gridSize);
    };

    //Send toggled notes to the server for broadcast
    // @param x = x-coordinate on grid
	// @param y = y-coordinate on grid
    this.toggleNote = function(x, y){
        socket.emit('toggleNote', x, y);
    };

    //Send toggled row of notes to the server for broadcast
	// @param y = y-coordinate on grid
    this.toggleRow = function(y){
        socket.emit('toggleRow', y);
    };

    this.changeVolume = function(v){
        socket.emit("changeVolume", v);
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