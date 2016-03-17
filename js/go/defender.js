SCG.GO.DefenderState = {
	empty: {
		name: 'empty',
		upgradeTo : 'woodenFence',
		img: undefined,
		maxDefendersCount: 0,
		getMenuItems: function(){
			return [
				new SCG.GO.MenuItem({size: new Vector2(40,40), position: new Vector2, img: SCG.images.upgrade, 
					clickCallback: function(context) { 
						console.log('ok clicked'); 
						if(context && context.parent && context.parent.parent && context.parent.parent instanceof SCG.GO.Defender)
						{
							context.parent.parent.upgrade();
						}
					}}),
				//new SCG.GO.MenuItem({size: new Vector2(40,40), position: new Vector2, img: SCG.images.cross, clickCallback: function() { console.log('cancel clicked'); }})
			];
		}
		// lightProp : {
		// 	position: new Vector2,
		// 	size: new Vector2(30,30),
		// 	defaultRadiuses : [0, 20],
		// 	colorStops : [
		// 		{ offset: 0, color: 'rgba(255,255,255,0)' },
		// 		//{ offset: 0.1, color: 'rgba(255,255,255,0.5)' },
		// 		{ offset: 0.5, color: 'rgba(255,255,255,0.8)' },
		// 		{ offset: 1, color: 'rgba(255,255,255,0)' },
		// 	],
		// 	endingRadiusClamps : [17,20],
		// 	endingRadiusDelta : -0.25
		// }
	},
	woodenFence: {
		name: 'woodenFence',
		img: undefined,
		maxDefendersCount : 3,
		getMenuItems: function(){
			return [
				new SCG.GO.MenuItem({size: new Vector2(40,40), position: new Vector2, img: SCG.images.add_soldier, 
					clickCallback: function(context) { 
						console.log('add clicked'); 
						if(context && context.parent && context.parent.parent && context.parent.parent instanceof SCG.GO.Defender)
						{
							context.parent.parent.addDefender();
						}
					}}),
				new SCG.GO.MenuItem({size: new Vector2(40,40), position: new Vector2, img: SCG.images.cross, clickCallback: function() { console.log('cancel clicked'); }})
			];
		}
	},
	positions: [new Vector2(300,90), new Vector2(300,200), new Vector2(220,150), new Vector2(80,150), new Vector2(190,25), new Vector2(200,260), new Vector2(30,80), new Vector2(30,220)],
	init: function(){
		this.empty.img = SCG.images.placeholder;
		this.woodenFence.img = SCG.images.wooden_fence;
	}
}

SCG.GO.Defender = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG.GO.Defender -> position is undefined';
	}
	if(prop.size == undefined){prop.size = new Vector2(30,30); }
	SCG.GO.GO.call(this,prop);
	this.id = 'Defender' + (SCG.GO.Defender.counter++);

	this.state = undefined;
	this.light = undefined;
	this.menu = undefined;
	this.updatePlaceable = false;
	this.hasPlaceable = true;
	this.shouldRenderMenu = false;
	this.side = 1;
	this.defenderSoldiers = [];

	this.setState();
	SCG.Placeable.set(this);
	SCG.Placeable.playerUnits[this.id] = this;

	this.fireTimer = {
		lastTimeWork: new Date,
		delta : 0,
		currentDelay: 300,
		originDelay: 300,
		doWorkInternal : this.fire,
		context: this
	}


}

SCG.GO.Defender.counter = 0;
SCG.GO.Defender.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.Defender.prototype.constructor = SCG.GO.Defender;

SCG.GO.Defender.prototype.fire = function(){
	SCG.go.push(new SCG.GO.Shot({
		side: this.side,
		position: this.position.clone(),
		destination: new Vector2(500,50)
	}));
}

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

SCG.GO.Defender.prototype.upgrade = function()
{
	if(this.state.upgradeTo == undefined ){ return; }
	 this.setState(SCG.GO.DefenderState[this.state.upgradeTo]);
}

SCG.GO.Defender.prototype.addDefender = function()
{
	if(this.defenderSoldiers.length < this.state.maxDefendersCount)
	{

		if(this.defenderSoldiers.length == 0)
		{
			this.defenderSoldiers.push(new SCG.GO.DefenderSoldier({position: this.position.clone()}));
		}
		else{
			var angleStep = 360 / (this.defenderSoldiers.length + 1);
			var radius = (this.size.x / 2) * 0.3;
			var up = new Vector2(0, -radius);
			for(var i = 0;i<this.defenderSoldiers.length; i++)
			{
				this.defenderSoldiers[i].position = up.rotate(angleStep*i).add(this.position,true);
			}

			this.defenderSoldiers.push(new SCG.GO.DefenderSoldier({position: up.rotate(angleStep*this.defenderSoldiers.length).add(this.position,true)}));
		}
	}
}

SCG.GO.Defender.prototype.setState = function(state)
{
	if(state === undefined)
	{
		state = SCG.GO.DefenderState.empty;
	}

	this.state = state;
	this.img = state.img;

	var menu = new SCG.GO.Menu({size: new Vector2(100,20), position: new Vector2});
	if(state.getMenuItems){
		menu.setItems(state.getMenuItems());	
	}

	this.setMenu(menu);
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
	for(var i = 0; i< this.defenderSoldiers.length; i++)
	{
		this.defenderSoldiers[i].render();
	}

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

	for(var i = 0; i< this.defenderSoldiers.length; i++)
	{
		this.defenderSoldiers[i].update();
	}

	doWorkByTimer(this.fireTimer, now);
}