SCG.GO.DefenderState = {
	empty: {
		img: undefined,
		lightProp : {
			position: new Vector2,
			size: new Vector2(30,30),
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
	this.menu = undefined;

	this.shouldRenderMenu = false;

	this.setState();
}

SCG.GO.Defender.counter = 0;
SCG.GO.Defender.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.Defender.prototype.constructor = SCG.GO.Defender;

SCG.GO.Defender.prototype.setMenu = function(menu)
{
	menu.parent = this;
	menu.position = this.position.substract(new Vector2(0,menu.size.y-this.size.y),true)
	for(var i=0;i<menu.items.length;i++)
	{
		menu.items[i].position = menu.position.add(menu.items[i].position,true);
	}
	this.menu = menu;
}

SCG.GO.Defender.prototype.setState = function(state)
{
	if(state === undefined)
	{
		state = SCG.GO.DefenderState.empty;
	}

	this.state = state;
	this.img = state.img;

	// if(this.state.lightProp != undefined)
	// {
	// 	this.state.lightProp.radius = this.size.x;
	// 	this.state.lightProp.position = new Vector2(this.state.lightProp.radius/2 - this.size.x/2,this.state.lightProp.radius/2 - this.size.y/2);
	// 	this.state.lightProp.defaultRadiuses[1] = this.size.x; 
	// 	this.state.lightProp.endingRadiusClamps[0] = this.size.x*0.6; 
	// 	this.state.lightProp.endingRadiusClamps[1] = this.size.x*0.8; 
	// 	this.light = new SCG.GO.Light(this.state.lightProp)
	// }
}

SCG.GO.Defender.prototype.internalPreRender = function(){ 
	if(this.light != undefined)
	{
		SCG.context.translate(this.renderPosition.x,this.renderPosition.y);

		this.light.render();

		SCG.context.translate(-this.renderPosition.x,-this.renderPosition.y);
	}
}

SCG.GO.Defender.prototype.internalRender = function(){ 
	if(this.shouldRenderMenu && this.menu != undefined)
	{
		this.menu.render();
	}
}

SCG.GO.Defender.prototype.internalPreUpdate = function(){ 
	if(this.light != undefined)
	{
		this.light.update();
	}
}

SCG.GO.Defender.prototype.internalUpdate = function(now){ 
	this.shouldRenderMenu = (SCG.gameControls.mousestate.leftButtonDown || SCG.gameControls.mousestate.click.isClick) && (this.mouseOver || this.menu.mouseOver);
	if(this.shouldRenderMenu && this.menu != undefined)
	{
		this.menu.update();
	}
}