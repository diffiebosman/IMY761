var Grid = function(container, instrument, BPM, gridSize, clientSocket){
	var grid = new Array();
	var isDragging = false;	
    
    clientSocket.listen(updateGrid, clearGrid, gridSize);

	$('body').on('mousedown', function () {
		isDragging = true;
	})
	.on('mouseup', function(){
		isDragging = false;
	});

	// Initialize the grid and add event handlers to divs
	this.init = function(){
		for(var x= 0; x < gridSize; x++){
			grid.push([]);
			for(var y = 0; y < gridSize; y++){
				grid[x][y] = false;
			}
		}

		for(var i = 0; i < gridSize; i++){
			$(container).append('<div class="padRow" data-y="'+i+'"></div>');
		}

		$('.padRow').each(function(y){
			$(this).append('<div><i class="fa fa-chevron-circle-right" data-y="'+y+'"></i></div>');
			for(var i = 0; i < gridSize; i++){
				$(this).append('<div data-x="'+i+'" data-y="'+y+'" class="animated"></div>');
			}
			$(this).append('<div><i class="fa fa-chevron-circle-left" data-y="'+y+'"></i></div>');			
		});

		var volumeDial = $('<input>')
				.attr({
					'type': 'text',
					'value':'75',
					'class': 'volumeDial',
					'data-width': '36',
					'data-height': '36',
					'data-fgColor': '#B8D0E8',
					'data-angleOffset': '-125',
					'data-angleArc': '250'
				});

		// Create bottom border and grid controls
		$(container).append('<hr/>');
		$(container).append(
			$('<div></div>')
			.addClass('controls')
			.append(
				$('<div></div>')
				.addClass('controlDial')
				.append(volumeDial)
			)
			.append(
				$('<i></i>')
				.addClass('fa fa-undo animated')
			)				
		);
		
		/*************   EVENT HANDLERS  ***************************/
		$(container).find("div.padRow div").each(function(){
			$(this)
			.on('mousedown',function(){
				updateGrid($(this).data('x'), $(this).data('y'));
                clientSocket.toggleNote($(this).data('x'), $(this).data('y'));
			})
			.on('mouseup',function(){
				isDragging = false;
			})
			.on('mouseover', function(){
				if(isDragging){
					updateGrid($(this).data('x'), $(this).data('y'));
                    clientSocket.toggleNote($(this).data('x'), $(this).data('y'));
				}
			});
		});

		$(container).find(".padRow i.fa").on('click', function(){
			var y = $(this).data('y');
			for(var x = 0; x < gridSize; x++){
				updateGrid(x, y);                
			}
            
            clientSocket.toggleRow(y);
		});

		$('div.controls i').on('click', function(){
			clearGrid();
            clientSocket.clearAll();
		});		

		$(".volumeDial").knob({
            'change' : function (v) { instrument.setVolume(v); }
        });		
		/*************************************************************/
	};

	// Toggle buttons on grid (on/off)
	// @param x = x-coordinate on grid
	// @param y = y-coordinate on grid
	function updateGrid(x, y){
		grid[x][y] = !grid[x][y];	
		$(container).find('.padRow[data-y ="'+y+'"] div[data-x="'+x+'"]').toggleClass('active');
	
		updateColorBorder();	
	}

	// Changes the color of the bottom border of the grid depending on how many blocks are selected
	function updateColorBorder(){
		var rgb = getTweenedColor(getNumBlocks());
		$(container).find('hr').css('border-color', 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')');		
	}

	// Print out the contents in the grid to an element
	// @param element = DOM element to write grid contents to
	function printGrid(element){
		$(element).html('');
		for(var x= 0; x < gridSize; x++){
			for(var y = 0; y < gridSize; y++){
				$(element).append(grid[y][x] + ", ");
			}
			$(element).append("<br/>");
		}
	}

	// Resets the grid
	function clearGrid(){
		for(var x = 0; x < gridSize; x++){
			for(var y = 0; y < gridSize; y++){
				grid[x][y] = false;
			}
		}
		$(container).find('.padRow div').removeClass('active');

		updateColorBorder();
	}

	// Returns the number of activated blocks
	function getNumBlocks(){
		var i = 0;
		for(var x = 0; x < gridSize; x++){
			for(var y = 0; y < gridSize; y++){
				if(grid[x][y]) i++;
			}
		}
		return i;
	}

	// Returns RGB-values from Greem to Red depending on the number of blocks activated (more blocks = more red)
	// @param numBlocks = number of blocks activated
	function getTweenedColor(numBlocks){
		var startR = 200;
		var startG = 200;
		var startB = 200;

		var endR = 246;
		var endG = 12;
		var endB = 12;

		var percentageActivated = (numBlocks / Math.pow(gridSize, 2));

		return {
					r: Math.round(getTweenValue(startR, endR, percentageActivated)),
					g: Math.round(getTweenValue(startG, endG, percentageActivated)),
					b: Math.round(getTweenValue(startB, endB, percentageActivated))
				};
	}

	// Returns a scaled value between start and end based on the percantage of blocks activated
	// @param start = start value
	// @param end = end value
	// @param percantageActivated = scaling value
	function getTweenValue(start, end, percentageActivated){
		return start + ( (end-start) * percentageActivated );
	}	

	// Infintely loop through grid and play activvated notes in columns
	this.loopThroughGrid = function(){
		var x = 0;
		var interval = (60/BPM) * 1000;
		setInterval(function(){playGridColumns((x++) % gridSize)}, interval);
	}

	// Play activated notes in grid column
	// @param x = grid column to play notes in
	function playGridColumns(x){
		var semitone;
		grid[x].forEach(function(element, index, array){
			if(element){
				instrument.play(gridSize - index - 1);	
			} 
			$('div.highlighted').removeClass('highlighted');
			$(container).find('.padRow div[data-x ="'+x+'"]').addClass('highlighted');
		});
	}
};