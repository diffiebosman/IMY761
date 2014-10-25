module.exports = function(){

	var grid = [];
	var size = 0;
	var volume = 50;
	var initialised = false;
	var owner = null;
	var type = null;

	//initialise the grid if it doesnt exist and return null
	//return the grid if it does already exist
	this.init = function(gridSize, name, instrument){
		if(!initialised){
			size = gridSize;
			owner = name;
			type = instrument;
			for(var x= 0; x < size; x++){
				grid.push([]);
				for(var y = 0; y < size; y++){
					grid[x][y] = false;
				}
			}
			initialised = true;
			console.log("Initialising grid '" + owner + "' of size: " + gridSize);
			return null;
		}

		return grid;
	};

	this.getOwner = function(){
		return owner;
	};

	this.getGrid = function(){
		return grid;
	};

	this.setVolume = function(v){
		volume = v;
		return volume;
	};

	this.getVolume = function(){
		return volume;
	};

	this.getType = function(){
		return type;
	};

	this.toggleNote = function(x, y){
		if(initialised){
			grid[x][y] = !grid[x][y];
		}
	};

	this.toggleRow = function(y){
		if(initialised){
			for(var x = 0; x < size; x++){
				grid[x][y] = !grid[x][y];
			}
		}
	};

	this.clearAll = function(){
		if(initialised){
			for(var x= 0; x < size; x++){
				for(var y = 0; y < size; y++){
					grid[x][y] = false;
				}
			}
		}
	};

};