var Oscillator = function(context, audiobus, baseNote, scale){
	var semitoneRatio = Math.pow(2, 1/12);


	// Gets the appropriate amount of semitones from the root note
	// @param step = the number of steps of the note above the root note in the scale
	// @param scale = the scale used 
	function getNoteFromScale(step){
		var length = scale.length;
		//alert(length);
		var octaves = 0;
		for( ; length<=step; step-=length, octaves++); // get the amount of octaves the step is above 1st octave
	
		return scale[step % scale.length] + (octaves * 12);
	}

	// Calculates the frequency of the note given the amount of steps above the root note
	// @param numSemitones = the amount of semitones above the root note of the note
	function getNote(numSemitones){
		return baseNote * Math.pow(semitoneRatio, numSemitones);
	}

	// Creates two oscillators and plays two notes an octave apart through the audio bus
	// @param step = the step of the note in the scale (the how many-th note in the scale to play)
	this.play = function(step) {
		var osc = context.createOscillator();
		var osc2 = context.createOscillator();

    	osc.frequency.value = getNote(getNoteFromScale(step));
    	osc2.frequency.value = getNote(getNoteFromScale(step)) * 2;
    	
    	var g = context.createGain();

    	osc.connect(g);
    	osc2.connect(g);
    	g.connect(audiobus.input);

    	//g.gain.value = 0;

    	//sets the gain to 0 before ending the note (to get rid of that clicking sound)
		osc.noteOn(0);
		osc2.noteOn(0);
		setTimeout(function(){g.gain.value = 2;}, 0);
		setTimeout(function(){g.gain.value = 0;}, 200);
		setTimeout(function(){osc.noteOff(0); osc = null;}, 250);
		setTimeout(function(){osc2.noteOff(0); osc2 = null;}, 250);
	}

	// nothing to initialize when using an oscillator
	this.init = function(){
		return false;
	}

    // sets the volume of the audiobus
    // @param volume = value between 0 and 100 for volume	
	this.setVolume = function(volume){
		audiobus.setVolume(volume);
	}

    // sets the drive of the overdrive for the audiobus
    // @param value = value between 0 and 100 for frequency
    this.setDrive = function(value){
		audiobus.setDrive(value);
		//console.log(value);
	}	

	//used for setting the grid colours
	this.name = "Oscillator";
}