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
	var gridA = new Grid($('#padContainerA'), instrument, BPM, gridSize, clientSocket); // These are sharing an instrument for now...
	var gridB = new Grid($('#padContainerB'), instrument, BPM, gridSize, clientSocket); // So Volume/Overdrive is shared, each should have its own instrument eventually

	$('.containerA').css('max-width', 28 * gridSize + 100);
	$('.containerA').css('height', 28 * gridSize + 100);
	$('.containerB').css('max-width', 28 * gridSize + 100);
	$('.containerB').css('height', 28 * gridSize + 100);

	bus.connect(context.destination);

	gridA.init("A"); //Grid A is the users own grid
	gridB.init("B"); //Grid B is the other/remote users grid, this will eventually not be editable by the local user
	clientSocket.initGrid(gridSize, "A");
	clientSocket.initGrid(gridSize, "B");
	gridA.loopThroughGrid();
	gridB.loopThroughGrid();
});