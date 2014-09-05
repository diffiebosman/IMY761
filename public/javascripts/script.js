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

	var clientSocket = new ClientSocket(); //Used for all communication with server other than signing in

	start(local_data);

	bus.connect(context.destination);

function start(localClientName){
	//Only used for setting up
	var loginSocket = new ClientSocket();

	//Send server the clients name for setting up local grid
	loginSocket.signInResponse(setUpLocalGrid, localClientName);
	loginSocket.signIn(gridSize, localClientName);

	//Request the grids of other connected users (remote users)
	loginSocket.getRemoteGrids(localClientName);
	loginSocket.remoteGridResponse(setUpRemoteGrids, localClientName);
}

function setUpLocalGrid(msg, name){
	var localGrid = new Grid($('#padContainerLocal'), instrument, BPM, gridSize, clientSocket); // These are sharing an instrument for now...

	$('.containerLocal').css('max-width', 28 * gridSize + 100);
	$('.containerLocal').css('height', 28 * gridSize + 100);

	localGrid.init(name, msg); //Grid A is the users own grid
	localGrid.loopThroughGrid();
}

function setUpRemoteGrids(msg){
	var grids = msg.data;

	for(var i = 0; i < grids.length; i++){
		var remoteGrid = new Grid($('#padContainerRemote'), instrument, BPM, gridSize, clientSocket); // These are sharing an instrument for now...

		$('.containerRemote').css('max-width', 28 * gridSize + 100);
		$('.containerRemote').css('height', 28 * gridSize + 100);

		var newMsg = {
			type: "initResponse",
			owner: grids[i].name,
			data: grids[i].grid,
			volume: grids[i].vol
		};

		remoteGrid.init(grids[i].name, newMsg); //Grid A is the users own grid
		remoteGrid.loopThroughGrid();
	}
}