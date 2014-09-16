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
	var localGridBlock = {size: 20, margin: 8};
	var remoteGridBlock = {size: 8, margin: 4};

	//Global factories
	var context = new (window.AudioContext || window.webkitAudioContext)();
	var bus = new AudioBus(context);
	//var instrument = new Oscillator(context, bus, A, minorScale);
	var instrument = new SamplePlayer(context, bus, A, pentatonicScale, 'rhodes');
	instrument.init();
	instrument.setVolume(50);

	var clientSocket = new ClientSocket(); //Used for all communication with server other than signing in
	var remoteGridUsed = [false, false, false]; //Tracks which grid have already been initialized, prevents duplication when a new user joins

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

	//Waits for new users to join and adds grids for them without refreshing
	loginSocket.listentForNewUsers(localClientName);
}

function setUpLocalGrid(msg, name){
	var localGrid = new Grid($('#padContainerLocal'), instrument, BPM, gridSize, clientSocket); // These are sharing an instrument for now...

	$('.containerLocal').css('max-width', (localGridBlock.size + localGridBlock.margin) * gridSize + ((localGridBlock.size* 2) + localGridBlock.margin));
	$('.containerLocal').css('height', (localGridBlock.size + localGridBlock.margin) * gridSize + 100);

	localGrid.init(name, msg); //Grid A is the users own grid
	localGrid.loopThroughGrid();
}

function setUpRemoteGrids(msg){
	var grids = msg.data;
	//console.log(grids.length);

	for(var i = 0; i < grids.length; i++){
		//console.log(i);
		if(remoteGridUsed[i] === false){
			var remoteGrid = new Grid($('#padContainerRemote' + i), instrument, BPM, gridSize, clientSocket); // These are sharing an instrument for now...
			remoteGridUsed[i] = true;

			$('.containerRemote' + i).css('max-width', (remoteGridBlock.size + remoteGridBlock.margin) * gridSize);
			$('.containerRemote' + i).css('height', (remoteGridBlock.size + remoteGridBlock.margin) * gridSize + 100);

			var newMsg = {
				type: "initResponse",
				owner: grids[i].name,
				data: grids[i].grid,
				volume: grids[i].vol
			};

			remoteGrid.init(grids[i].name, newMsg);
			remoteGrid.loopThroughGrid();
		}
	}
}