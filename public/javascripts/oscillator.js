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

	// Creates an oscillator and plays a note through the audio bus
	// @param step = the step of the note in the scale (the how many-th note in the scale to play)
	this.play = function(step) {
		var osc = context.createOscillator();
    	osc.frequency.value = getNote(getNoteFromScale(step));
    	
    	var g = context.createGain();

    	osc.connect(g);
    	g.connect(audiobus.input);

    	//g.gain.value = 0;

		osc.noteOn(0);
		setTimeout(function(){g.gain.value = 1;}, 0);
		setTimeout(function(){g.gain.value = 0;}, 200);
		setTimeout(function(){osc.noteOff(0); osc = null;}, 250);
	}
	
    // sets the volume of the audiobus
    // @param volume = value between 0 and 100 for volume	
	this.setVolume = function(volume){
		audiobus.setVolume(volume);
	}
}