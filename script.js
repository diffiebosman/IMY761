$(function(){

	//Music variables
	var freqs = [440, 493.88, 523.25, 587.33, 659.26, 698.46, 783.99, 880];
	var A = 220; // lowest note
	var semitoneRatio = Math.pow(2, 1/12);
	var BPM = 240;

	//Grid Variables
	var grid = new Array();
	var gridSize = 12;

	//Global factories
	var context = new (window.AudioContext || window.webkitAudioContext)();

	//Main audio bus (everything connects to the same audio bus so you don't have to recreate the same effects over and)
	var bus = new AudioBus(context);	
	bus.connect(context.destination);



	//****************   INITIALIZE GRID  *******************//

	for(var x= 0; x < gridSize; x++){
		grid.push([]);
		for(var y = 0; y < gridSize; y++){
			grid[x][y] = false;
		}
	}	

	$('.container').css('max-width', 40 * gridSize);
	$('.container').css('height', 40 * gridSize);

	for(var i = 0; i < gridSize; i++){
		$("#padContainer").append('<div class="padRow" data-y="'+i+'"></div>')
	}

	$('.padRow').each(function(y){
		for(var i = 0; i < gridSize; i++){
			$(this).append('<div data-x="'+i+'" data-y="'+y+'"></div>');
		}
	});

	$("div#padContainer div div").each(function(){
		$(this).on('mousedown',function(){
			//play(getNote(gridSize - $(this).data('y')));
			updateGrid($(this).data('x'), $(this).data('y'));
		});
	});

	//*********************************************************//

	
	loopThroughGrid();

	function getNote(numSemitones){
		return A * Math.pow(semitoneRatio, numSemitones);
	}

	function play(freq) {		
		//I'm making a new oscillator each time you press a note, because that slidey thing is pissing me off
		var osc = context.createOscillator();
    	osc.frequency.value = freq;

    	osc.connect(bus.input);
    	
		osc.noteOn(0);
		setTimeout(function(){osc.noteOff(0);osc = null;}, 200);
	}			
	
	function updateGrid(x, y){
		grid[x][y] = !grid[x][y];
		
		//printGrid();
		$('#padContainer .padRow[data-y ="'+y+'"] div[data-x="'+x+'"]').toggleClass('active');
	}		

	function printGrid(){
		$('#printGrid').html('');
		for(var x= 0; x < gridSize; x++){
			for(var y = 0; y < gridSize; y++){
				$('#printGrid').append(grid[y][x] + ", ");
			}
			$('#printGrid').append("<br/>");
		}		
	}

	function loopThroughGrid(){
		var x = 0;
		setInterval(function(){getGridColumns((x++) % gridSize)}, (60/BPM) * 1000);
	}

	function getGridColumns(x){
		grid[x].forEach(function(element, index, array){
			if(element) play(getNote(gridSize - index));
			$('div.highlighted').removeClass('highlighted');
			$('#padContainer .padRow div[data-x ="'+x+'"]').addClass('highlighted');
		});
	}
});



