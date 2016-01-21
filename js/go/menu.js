SCG.GO.Menu = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG2.GO.Menu -> position is undefined';
	}

	SCG.GO.GO.call(this,prop);
	this.id = 'Menu' + (SCG.GO.Menu.counter++);
	this.items = [];
	this.parent = undefined;
}

SCG.GO.Menu.counter = 0;
SCG.GO.Menu.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.Menu.prototype.constructor = SCG.GO.Menu;

SCG.GO.Menu.prototype.internalRender = function(){ 
	SCG.context.beginPath();
	SCG.context.rect(this.renderPosition.x - this.renderSize.x/2, this.renderPosition.y - this.renderSize.y/2, this.renderSize.x, this.renderSize.y);
	SCG.context.fillStyle = 'yellow';
	SCG.context.fill();
	SCG.context.lineWidth = 7;
	SCG.context.strokeStyle = 'black';
	SCG.context.stroke();
}

SCG.GO.Menu.prototype.internalPreUpdate = function(){ 
	if(this.parent!=undefined)
	{
		this.position = this.parent.position.substract(new Vector2(0,this.size.y*0.75),true);	
	}
	
}