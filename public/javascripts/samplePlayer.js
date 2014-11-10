var SamplePlayer = function(context, audiobus, baseNote, scale, sampleName){
	var volume = 100;
	var drive = 50;

	// Gets the appropriate amount of semitones from the root note
	// @param step = the number of steps of the note above the root note in the scale
	// @param scale = the scale used 
	function getNoteFromScale(step){
		var length = scale.length;
		
		var octaves = 0;
		for( ; length<=step; step-=length, octaves++); // get the amount of octaves the step is above 1st octave
	
		return scale[step % scale.length] + (octaves * 12) + 1;
	}

	// Plays a note using audio samples
	// @param step = the step of the note in the scale (the how many-th note in the scale to play)
	this.play = function(step) {
		var note = sampleName == 'Drums' ? step + 1 : getNoteFromScale(step);

		var sound = new Howl({
		  urls: ['/samples/'+sampleName+'/'+note+'.wav'],
		  volume: (this.volume * 0.4)
		});
		sound.play();
	}

    // sets the volume of the audiobus
    // @param volume = value between 0 and 100 for volume	
	this.setVolume = function(volume){
		this.volume = volume * 0.2;
	}	

    // You can't set the drive on a sample
    this.setDrive = function(value){
		return false;
	}

	// preload samples to avoid lagging when using the samples for the first time
	this.init = function(){
		var l; // number of existing samples for an instrument

		if(sampleName == 'Drums')
			l = 16;
		else l = 38;

		for(var i = 1; i <= l; i++){
			var sound = new Howl({
			  urls: ['/samples/'+sampleName+'/'+i+'.wav'],
			  volume: 0
			}).play();
		}
	}

	//used for setting the grid colours
	this.name = function(){ 
		return sampleName;
	}();
};