var ClientSocket = function(){
    var socket = io();

    //Inform the server of the size of the grid to be used
    // @param gridSize = size of Note Grid
    this.initGrid = function(gridSize){
        socket.emit('initGrid', gridSize);
    }
    
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
            //Toggle note specified by server
            if(msg.type === "toggleNote"){
                updateGrid(msg.xval, msg.yval);
            }
            else if(msg.type === "toggleRow"){
                //toggle row specified by server
                for(var x = 0; x < gridSize; x++){
				    updateGrid(x, msg.yval);                
			    }
            }
            else if(msg.type === "clearAll"){
                //clear grid specified by server
                clearGrid();
            }
            else if(msg.type === "initResponse" && msg.data != null){
                //duplicate state of server grid in the browser
                for(var x= 0; x < gridSize; x++){
                    for(var y = 0; y < gridSize; y++){
                        if(msg.data[x][y] === true)
                            updateGrid(x, y);
                    }
                }                
            }
        });
    };
};