SCG.Animations = {
	types: {
		smallExplosion: 1
	},
	smallExplosion: {
		totalFrameCount: 81,
		framesInRow: 9,
		framesRowsCount: 9,
		frameChangeDelay: 6,
		destinationFrameSize: new Vector2(10,10),
		sourceFrameSize: new Vector2(100,100),
		explosionImageType: 1
	},
	createObject: function(type, position){
		var obj = undefined;
		switch(type){
			case this.types.smallExplosion:
				obj = new SCG.GO.Animated($.extend({}, this.smallExplosion, {img : SCG.images.explosion_sheet, position : position }));
				break
			default: 
				break;
		}

		if(obj!= undefined){
			SCG.go.unshift(obj);
		}
	}

}

SCG.GO.Animated = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG.GO.Animated -> position is undefined';
	}

	if(prop.size == undefined){ prop.size = new Vector2(10,10); }
	SCG.GO.GO.call(this,prop);

	//overriding defaults and props
	this.id = 'Animated' + (SCG.GO.Animated.counter++);

	this.size = prop.destinationFrameSize.clone();
	this.currentFrame = 0;
	this.currentDestination = new Vector2;
	this.loop = false;

	//this.img = this.explosionImageType == 1 ? SCG.images.explosion_sheet; : undefined;

	this.animationTimer = {
		lastTimeWork: new Date,
		delta : 0,
		currentDelay: this.frameChangeDelay,
		originDelay: this.frameChangeDelay,
		doWorkInternal : this.frameChange,
		context: this
	}
}

SCG.GO.Animated.counter = 0;
SCG.GO.Animated.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.Animated.prototype.constructor = SCG.GO.Animated;

SCG.GO.Animated.prototype.frameChange = function(){
	this.currentFrame++;
	if(this.currentFrame > this.totalFrameCount){
		if(this.loop){
			this.currentFrame = 1;
		}
		else{
			this.setDead();
			return;
		}
	}
	var crow = this.framesRowsCount - parseInt((this.totalFrameCount - this.currentFrame) / this.framesInRow);
	var ccol = this.framesInRow + parseInt((this.currentFrame - (this.framesInRow * crow)));
	this.currentDestination = new Vector2(ccol - 1, crow - 1);
}

SCG.GO.Animated.prototype.render = function(){
	if(!this.alive){
		return false;
	}

	SCG.context.drawImage(this.img,  
		this.currentDestination.x * this.sourceFrameSize.x,
		this.currentDestination.y * this.sourceFrameSize.y,
		this.sourceFrameSize.x,
		this.sourceFrameSize.y,
		this.renderPosition.x - this.renderSize.x/2,
		this.renderPosition.y - this.renderSize.y/2,
		this.renderSize.x,
		this.renderSize.y
	);
}

SCG.GO.Animated.prototype.internalUpdate = function(now){
	doWorkByTimer(this.animationTimer, now);
}
