SCG.GO.Light = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG2.GO.Light -> position is undefined';
	}

	SCG.GO.GO.call(this,prop);
	this.id = 'Light' + (SCG.GO.Light.counter++);

	var canvas = document.createElement("canvas");
	canvas.id = this.id;
	canvas.width = this.size.x;
	canvas.height = this.size.y;
	canvas.style.display = 'none';
	document.body.appendChild(canvas);

	this.canvas = canvas;
	this.context = canvas.getContext("2d");
	
	this.statrtingCircleCenter = new Vector2(this.size.x/2, this.size.y/2);
	this.endingCircleCenter = new Vector2(this.size.x/2, this.size.y/2);
	this.defaultRadiuses = [1, this.radius/2];
	this.startingRadius = 1;
	this.endingRadius = this.radius/2;

	this.internalRender();
	this.img = this.canvas;
}

SCG.GO.Light.counter = 0;
SCG.GO.Light.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.Light.prototype.constructor = SCG.GO.Light;

SCG.GO.Light.prototype.setDead = function(){ 
	this.alive = false;
	// remove canvas
	$('#' + this.id).remove();
}

SCG.GO.Light.prototype.internalRender = function(){ 
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var g = this.context.createRadialGradient(this.statrtingCircleCenter.x, this.statrtingCircleCenter.y, this.startingRadius, this.endingCircleCenter.x, this.endingCircleCenter.y, this.endingRadius);
	g.addColorStop( 0, 'rgba(255,255,255,0.8)' );
    g.addColorStop( 1, 'rgba(255,255,255,0)' );
    this.context.fillStyle = g;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
}

SCG.GO.Light.prototype.internalUpdate = function(now){ 
	if(this.endingRadiusDelta == undefined)
	{
		this.endingRadiusDelta = -0.5;
	}

	if(this.iterationCount == undefined)
	{
		this.iterationCount = 0;	
	}

	if((this.endingRadiusDelta < 0 && this.defaultRadiuses[0] > (this.endingRadius + this.endingRadiusDelta)) 
		|| (this.endingRadiusDelta > 0 && this.defaultRadiuses[1] < (this.endingRadius+this.endingRadiusDelta)))
	{
		this.endingRadiusDelta*=-1;
		if(this.endingRadiusDelta > 0)
		{
			this.iterationCount++;
		}

		if(this.iterationCount > 3)
		{
			this.setDead();
			var testLight =  new SCG.GO.Light({
				position: new Vector2(getRandom(12,SCG.battlefield.default.width-12),getRandom(12, SCG.battlefield.default.height)),
				radius: getRandom(50,100),
			});
			SCG.go.push(testLight);	
		}
	}

	this.endingRadius += this.endingRadiusDelta;
}