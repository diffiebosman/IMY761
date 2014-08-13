module.exports = function(){

	var grid = new Array();
	var size = 0;
	var initialised = false;

	//initialise the grid if it doesnt exist and return null
	//return the grid if it does already exist
	this.init = function(gridSize){
		size = gridSize;

		if(!initialised){
			for(var x= 0; x < size; x++){
				grid.push([]);
				for(var y = 0; y < size; y++){
					grid[x][y] = false;
				}	
			}
			initialised = true;
			console.log("Initialising grid of size: " + gridSize);
			return null;
		}		

		return grid;
	}

	this.toggleNote = function(x, y){
		if(initialised){
			grid[x][y] = !grid[x][y];
		}		
	}

	this.toggleRow = function(y){
		if(initialised){
			for(var x = 0; x < size; x++){
				grid[x][y] = !grid[x][y];   
			}
		}		
	}

	this.clearAll = function(){
		if(initialised){
			for(var x= 0; x < size; x++){
				for(var y = 0; y < size; y++){
					grid[x][y] = false;
				}	
			}	
		}		
	}

};