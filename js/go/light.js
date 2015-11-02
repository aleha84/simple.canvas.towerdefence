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
	
	this.internalUpdate();
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
	
}

SCG.GO.Light.prototype.internalUpdate = function(now){ 
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	var g = this.context.createRadialGradient(this.size.x/2, this.size.y/2, 0, this.size.x/2, this.size.x/2, this.radius/2);
	g.addColorStop( 0, 'rgba(250,220,150,1)' );
    g.addColorStop( 1, 'rgba(250,220,150,0)' );
    this.context.fillStyle = g;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
}