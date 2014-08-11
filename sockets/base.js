var PersistentGrid = require('../sockets/persistentGrid');
var persistentGrid = new PersistentGrid();

module.exports = function(io){

    io.on('connection', function(socket){
      socket.on('initGrid', function(gridSize){        
        var result = persistentGrid.init(gridSize);

          var msg = {
            type: "initResponse",
            data: result
          }

          socket.emit('response', msg);  
      });

      socket.on('toggleNote', function(x, y){
        persistentGrid.toggleNote(x, y);
        console.log("Toggle Note: X = " + x + ", Y = " + y);
        
        var msg = {
            type: "toggleNote",
            xval: x,
            yval: y
        };
        
        socket.broadcast.emit('response', msg);
      });

      socket.on('toggleRow', function(y){
        persistentGrid.toggleRow(y);
        console.log("Toggle Row: Y = " + y);
        
        var msg = {
            type: "toggleRow",
            yval: y
        };
        
        socket.broadcast.emit('response', msg);
      });
      
      socket.on('clearAll', function(){
        persistentGrid.clearAll();
        console.log("Clear All");
        
        var msg = {
            type: "clearAll",
        };
        
        socket.broadcast.emit('response', msg);
      });
    });

}