module.exports = function(io){

    io.on('connection', function(socket){
      socket.on('toggleNote', function(x, y){
        console.log("Toggle Note: X = " + x + ", Y = " + y);
        
        var msg = {
            type: "toggleNote",
            xval: x,
            yval: y
        };
        
        socket.broadcast.emit('response', msg);
      });
      
      socket.on('toggleRow', function(y){
        console.log("Toggle Row: Y = " + y);
        
        var msg = {
            type: "toggleRow",
            yval: y
        };
        
        socket.broadcast.emit('response', msg);
      });
      
      socket.on('clearAll', function(){
        console.log("Clear All");
        
        var msg = {
            type: "clearAll",
        };
        
        socket.broadcast.emit('response', msg);
      });
    });

}