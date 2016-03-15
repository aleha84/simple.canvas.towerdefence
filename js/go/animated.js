SCG.Animations = {
	smallExplosion: {
		totalFrameCount: 81,
		framesInRow: 9,
		framesRowsCount: 9,
		frameChangeDelay: 6,
		destinationFrameSize: new Vector2(10,10),
		sourceFrameSize: new Vector2(100,100),
		explosionImageType: 1
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

	this.currentFrame = 0;
	this.currentDestination = new Vector2;
	this.loop = false;

	this.img = this.explosionImageType == 1 ? SCG.images.explosion_sheet; : undefined;

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

SCG.GO.Animated.prototype.render = function(){

}

SCG.GO.Animated.prototype.internalUpdate = function(now){
	doWorkByTimer(this.animationTimer, now);
}
