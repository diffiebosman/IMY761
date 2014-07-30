var AudioBus = function(context){
	var tuna = new Tuna(context);

	this.input = context.createGain();
    var output = context.createGain();
    var gainNode = context.createGain();
    var biquad = context.createBiquadFilter();

	biquad.frequency.value = 20;
	gainNode.gain.value = 50;	

	var delay = new tuna.Delay({
        feedback: 0.5,    //0 to 1+
        delayTime: 150,    //how many milliseconds should the wet signal be delayed? 
        wetLevel: 0.15,    //0 to 1+
        dryLevel: 0.15,       //0 to 1+
        cutoff: 15000,        //cutoff frequency of the built in highpass-filter. 20 to 22050
        bypass: 0
    });				

    this.input.connect(gainNode);
    gainNode.connect(delay.input);
    delay.connect(biquad);
    biquad.connect(output);


	this.connect = function(target){
       output.connect(target);
    };    
};