$(function(){

	//*********************** VARIABLES ********************************//
	//Scales
	var pentatonicScale = [1, 4, 6, 8, 11];
	var majorScale = [1, 3, 5, 6, 8, 10, 12];
	var minorScale = [1, 3, 4, 6, 8, 9, 11];
	var diminished = [1, 4, 7, 10];
	var wholeTone = [1, 3, 5, 7, 9, 11];
	var harmonicMinor = [1, 3, 4, 6, 8, 9, 12];
	var chromatic = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

	//Music variables
	var A = 110; // lowest note
	var BPM = 240;

	//Grid Variables
	var gridSize = 16;

	//Global factories
	var context = new (window.AudioContext || window.webkitAudioContext)();
	var bus = new AudioBus(context);
	//var instrument = new Oscillator(context, bus, A, minorScale);
	var instrument = new SamplePlayer(context, bus, A, pentatonicScale);
    var clientSocket = new ClientSocket();
	var grid = new Grid($('#padContainer'), instrument, BPM, gridSize, clientSocket);

	$('.container').css('max-width', 28 * gridSize + 100);
	$('.container').css('height', 28 * gridSize + 100);	

	bus.connect(context.destination);

	grid.init();
	clientSocket.initGrid(gridSize);
	grid.loopThroughGrid();
});



