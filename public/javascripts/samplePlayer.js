var SamplePlayer = function(context, audiobus, baseNote, scale){

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

	this.play = function(step) {
		var sound = new Howl({
		  urls: ['/samples/vibraphone/'+getNoteFromScale(step)+'.wav']
		});
		//sound.connect(audiobus.input);
		sound.play();
		//loadBuffer('/samples/vibraphone/'+getNoteFromScale(step)+'.wav');
	}	

	/*
	var gainNode, bufferSource;
	gainNode = context.createGain();
	gainNode.gain.value = 1;
	gainNode.connect(audiobus.input);
	//loadBuffer('sound.wav');
	 
	var loadBuffer = function(url) {
	  // load the buffer from the URL
	  var xhr = new XMLHttpRequest();
	  xhr.open('GET', url, true);
	  xhr.responseType = 'arraybuffer';
	  xhr.onload = function() {
	    // decode the buffer into an audio source
	    context.decodeAudioData(xhr.response, function(buffer) {
	      if (buffer) {
	        bufferSource = context.createBufferSource();
	        bufferSource.buffer = buffer;
	        bufferSource.connect(gainNode);
	        bufferSource.start(0);
	      }
	    });
	  };
	  xhr.send();
	};	
	*/
};