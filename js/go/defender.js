SCG.GO.DefenderState = {
	empty: {
		img: undefined,
		lightProp : {
			position: new Vector2,
			defaultRadiuses : [0, 20],
			colorStops : [
				{ offset: 0, color: 'rgba(255,255,255,0)' },
				//{ offset: 0.1, color: 'rgba(255,255,255,0.5)' },
				{ offset: 0.5, color: 'rgba(255,255,255,0.8)' },
				{ offset: 1, color: 'rgba(255,255,255,0)' },
			],
			endingRadiusClamps : [17,20],
			endingRadiusDelta : -0.25
		}
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
	this.light = undefined;

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

	if(this.state.lightProp != undefined)
	{
		this.state.lightProp.radius = this.radius*4;
		this.state.lightProp.position = new Vector2(this.state.lightProp.radius/2 - this.radius/2,this.state.lightProp.radius/2 - this.radius/2);
		this.state.lightProp.defaultRadiuses[1] = this.radius; 
		this.state.lightProp.endingRadiusClamps[0] = this.radius*0.8; 
		this.state.lightProp.endingRadiusClamps[1] = this.radius; 
		this.light = new SCG.GO.Light(this.state.lightProp)
	}
}

SCG.GO.Defender.prototype.internalPreRender = function(){ 
	if(this.light != undefined)
	{
		SCG.context.translate(this.renderPosition.x,this.renderPosition.y);

		this.light.render();

		SCG.context.translate(-this.renderPosition.x,-this.renderPosition.y);
	}
}

SCG.GO.Defender.prototype.internalPreUpdate = function(){ 
	if(this.light != undefined)
	{
		this.light.update();
	}
}