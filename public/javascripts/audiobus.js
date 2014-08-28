var AudioBus = function(context){
	var tuna = new Tuna(context);

	this.input = context.createGain();
    var output = context.createGain();
    var gainNode = context.createGain();
    //var biquad = context.createBiquadFilter();

	//biquad.frequency.value = 20;
	gainNode.gain.value = 1;

    var compressor = new tuna.Compressor({
        threshold: -0.5,    //-100 to 0
        makeupGain: 100,     //0 and up
        attack: 1000,         //0 to 1000
        release: 1000,        //0 to 3000
        ratio: 20,          //1 to 20
        knee: 40,           //0 to 40
        automakeup: true,  //true/false
        bypass: 0
    });    

    var overdrive = new tuna.Overdrive({
        outputGain: 1,         //0 to 1+
        drive: 0.1,              //0 to 1
        curveAmount: 0.01,          //0 to 1
        algorithmIndex: 2,       //0 to 5, selects one of our drive algorithms
        bypass: 0
    });    

	var delay = new tuna.Delay({
        feedback: 0.3,    //0 to 1+
        delayTime: 250,    //how many milliseconds should the wet signal be delayed? 
        wetLevel: 0.15,    //0 to 1+
        dryLevel: 0.05,       //0 to 1+
        cutoff: 20000,        //cutoff frequency of the built in highpass-filter. 20 to 22050
        bypass: 0
    });				

    var filter = new tuna.Filter({
        frequency: 10000,         //20 to 22050
        Q: 0.01,                  //0.001 to 100
        gain: -40,               //-40 to 40
        filterType: 2,         //0 to 7, corresponds to the filter types in the native filter node: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass in that order
        bypass: 0
    });    


    var lowCutoffFilter = new tuna.Filter({
        frequency: 1000,         //20 to 22050
        Q: 0.1,                  //0.001 to 100
        gain: 30,               //-40 to 40
        filterType: 1,         //0 to 7, corresponds to the filter types in the native filter node: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass in that order
        bypass: 1
    });     

    var tremolo = new tuna.Tremolo({
        intensity: 0.5,    //0 to 1
        rate: 2,         //0.001 to 8
        stereoPhase: 5,    //0 to 180
        bypass: 1
    });

    this.input.connect(compressor.input);
    compressor.connect(overdrive.input);
    overdrive.connect(tremolo.input);
    tremolo.connect(delay.input);
    delay.connect(filter.input);
    filter.connect(output);
    //lowCutoffFilter.connect(gainNode);
    //gainNode.connect(output);

    // sets the volume of the audiobus
    // @param volume = value between 0 and 100 for volume
    this.setVolume = function(volume){
        output.gain.value = volume / 100;
    }

    // sets the drive of the overdrive for the audiobus
    // @param value = value between 0 and 100 for frequency
    this.setDrive = function(value){
        //filter.frequency = value * 2;
        overdrive.drive.value = value / 100 + 0.1;
        console.log(overdrive.drive.value);
    }

	this.connect = function(target){
       output.connect(target);
    };
};