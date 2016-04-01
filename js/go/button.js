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
	this.selectedImg = SCG.images.button_selected;
	this.selectedBlinkImg = SCG.images.button_selected_blink;
	this.alpha = 1;
	this.alphaBounds = [0.3,0.7]
	this.alphaDelta = 0.02;
	this.secondaryAlpha = 0.5;
	this.secondaryAlphaDelta = -0.02;
	this.opacyTimer = {
		lastTimeWork: new Date,
		delta : 0,
		currentDelay: 0,
		originDelay: 15,
		doWorkInternal : this.opacyChange,
		context: this
	}
}

SCG.GO.Button.counter = 0;
SCG.GO.Button.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.Button.prototype.constructor = SCG.GO.Button;

SCG.GO.Button.prototype.opacyChange = function(){ 
	if(this.alpha > this.alphaBounds[1]){
		this.alpha = this.alphaBounds[1];
	}
	else if(this.alpha < this.alphaBounds[0]){
		this.alpha = this.alphaBounds[0];
	}

	if(this.alpha == this.alphaBounds[0] || this.alpha == this.alphaBounds[1]){
		this.alphaDelta*=-1;
	}

	this.alpha += this.alphaDelta;

	if(this.secondaryAlpha > this.alphaBounds[1]){
		this.secondaryAlpha = this.alphaBounds[1];
	}
	else if(this.secondaryAlpha < this.alphaBounds[0]){
		this.secondaryAlpha = this.alphaBounds[0];
	}

	if(this.secondaryAlpha == this.alphaBounds[0] || this.secondaryAlpha == this.alphaBounds[1]){
		this.secondaryAlphaDelta*=-1;
	}

	this.secondaryAlpha += this.secondaryAlphaDelta;
}

SCG.GO.Button.prototype.internalPreUpdate = function(now){ 
	this.img = this.enabled ? this.enabledImg : this.disabledImg;
	if(this.selected){
		this.img = this.selectedImg;
	}
}

SCG.GO.Button.prototype.internalUpdate = function(now){ 
	if(this.mouseOver && SCG.gameControls.mousestate.click.isClick && !SCG.defenderMenu.clicked)
	{
		this.selected = !this.selected
		this.alpha = this.selected ? 0.5 : 1;
	}

	if(this.selected){
		doWorkByTimer(this.opacyTimer, now);
	}
}

SCG.GO.Button.prototype.internalPreRender = function(){  
	SCG.context.save();
	SCG.context.globalAlpha = this.alpha;
}

SCG.GO.Button.prototype.internalRender = function(){  
	
	SCG.context.globalAlpha = this.secondaryAlpha;

	SCG.context.drawImage(this.selectedBlinkImg, 
				(this.renderPosition.x - this.renderSize.x/2), 
				(this.renderPosition.y - this.renderSize.y/2), 
				this.renderSize.x, 
				this.renderSize.y);	

	SCG.context.restore();
}