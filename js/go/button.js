SCG.GO.Button = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG.GO.Button -> position is undefined';
	}

	if(prop.size == undefined){ prop.size = new Vector2(30,30); }
	SCG.GO.GO.call(this,prop);

	//overriding defaults and props
	this.img = SCG.images.button_inactive;
	this.id = 'Button' + (SCG.GO.Button.counter++);
	this.enabled = true;
	this.selected = false;
	this.enabledImg = SCG.images.button_active;
	this.disabledImg = SCG.images.button_inactive;
}

SCG.GO.Button.counter = 0;
SCG.GO.Button.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.Button.prototype.constructor = SCG.GO.Button;

SCG.GO.Button.prototype.internalPreUpdate = function(){ 
	this.img = this.enabled ? this.enabledImg : this.disabledImg;
}
