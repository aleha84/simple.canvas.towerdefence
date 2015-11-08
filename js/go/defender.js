SCG.GO.DefenderState = {
	empty: {
		img: undefined
	}
}

SCG.GO.Defender = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG2.GO.Defender -> position is undefined';
	}

	SCG.GO.GO.call(this,prop);
	this.id = 'Defender' + (SCG.GO.Defender.counter++);

	this.state = undefined;

	this.setState();
}

SCG.GO.Defender.counter = 0;
SCG.GO.Defender.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.Defender.prototype.constructor = SCG.GO.Defender;

SCG.GO.Defender.prototype.setState = function(state)
{
	if(state === undefined)
	{
		state = SCG.GO.DefenderState.empty;
	}

	this.state = state;
	this.img = state.img;
}