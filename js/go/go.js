SCG.GO = {};

SCG.GO.GO = function(prop){
	this.defaultInitProperties = {};
	this.position = new Vector2;
	this.renderPosition = new Vector2;
	this.alive = true;
	this.id = '';
	this.size = new Vector2;
	this.initialDirection = new Vector2;
	this.direction = new Vector2;
	this.speed = 0;
	this.angle = 0;
	this.radius = 10;
	this.renderRadius = 10;
	this.img = undefined;
	this.selected = false;
	this.playerControllable =false;
	this.destination = undefined;
	if(prop!=undefined)
	{
		$.extend(this,prop);
	}
	if(this.direction!=undefined)
	{
		this.initialDirection = this.direction;
	}
	if(this.size.equal(new Vector2)){
		this.size = new Vector2(this.radius,this.radius);
	}
	this.creationTime = new Date;
}

SCG.GO.GO.prototype = {
	constructor: SCG.GO.GO,

	setDead : function() {
		this.alive = false;
	},

	isAlive : function(){ 
		return this.alive;
	},

	render: function(){ 
		if(!this.alive || this.img == undefined){
			return false;
		}

		SCG.context.drawImage(this.img, 
			(this.renderPosition.x - this.renderRadius), 
			(this.renderPosition.y - this.renderRadius), 
			this.renderRadius, 
			this.renderRadius);

		this.internalRender();
	},

	internalRender: function(){

	},

	update: function(now){ 
		
		if(!this.alive || SCG.gameLogics.isPaused || SCG.gameLogics.gameOver || SCG.gameLogics.wrongDeviceOrientation){
			return false;
		}

		if(this.destination && this.position.distance(this.destination) < 10){
			this.destination = undefined;
		}
		else{
			this.position.add(this.direction.mul(this.speed));
		}
		
		this.renderRadius = this.radius * SCG.gameControls.scale.times;
		this.renderPosition = new Vector2(this.position.x * SCG.gameControls.scale.times, this.position.y * SCG.gameControls.scale.times);

		this.internalUpdate(now);
	},

	internalUpdate: function(){

	},

	renderSelectBox: function(){
		if(this.boundingBox === undefined)
		{
			return;
		}
		if(this.selectBoxColor === undefined)
		{
			this.selectBoxColor = {max:255, min: 100, current: 255, direction:1, step: 1, colorPattern: 'rgb({0},0,0)'};
			if(this.playerControllable)
			{
				this.selectBoxColor.colorPattern = 'rgb(0,{0},0)'
			}
		}
		

		this.boundingBox.render({fill:false,strokeStyle: String.format(this.selectBoxColor.colorPattern,this.selectBoxColor.current), lineWidth: 2});
		if(this.selectBoxColor.current >= this.selectBoxColor.max || this.selectBoxColor.current <= this.selectBoxColor.min)
		{
			this.selectBoxColor.direction *=-1;
		}
		this.selectBoxColor.current+=(this.selectBoxColor.step*this.selectBoxColor.direction);
	}
}