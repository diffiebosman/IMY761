var SamplePlayer = function(context, audiobus, baseNote, scale){

	// Gets the appropriate amount of semitones from the root note
	// @param step = the number of steps of the note above the root note in the scale
	// @param scale = the scale used 
	function getNoteFromScale(step){
		var length = scale.length;
		
		var octaves = 0;
		for( ; length<=step; step-=length, octaves++); // get the amount of octaves the step is above 1st octave
	
		return scale[step % scale.length] + (octaves * 12);
	}

	// Plays a note using audio samples
	// @param step = the step of the note in the scale (the how many-th note in the scale to play)
	this.play = function(step) {
		var sound = new Howl({
		  urls: ['/samples/vibraphone/'+getNoteFromScale(step)+'.wav']
		});
		sound.play();
	}
};