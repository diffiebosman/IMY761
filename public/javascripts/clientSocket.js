var ClientSocket = function(){
    var socket = io();
    
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
    
    //Send signal to clear the grid
    this.clearAll = function(){
        socket.emit('clearAll');
    };
    
    //Listener for server responses
    // @param updateGrid = function passed from grid
    // @param clearGrid = function passed from grid
    // @param gridSize = size of Note Grid
    this.listen = function(updateGrid, clearGrid, gridSize){
        socket.on('response', function(msg){
        
            if(msg.type === "toggleNote"){
                updateGrid(msg.xval, msg.yval);
            }
            else if(msg.type === "toggleRow"){
                for(var x = 0; x < gridSize; x++){
				    updateGrid(x, msg.yval);                
			    }
            }
            else if(msg.type === "clearAll"){
                clearGrid();
            }
          });
    };
};