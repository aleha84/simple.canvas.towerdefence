SCG.GO.MenuItem = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG2.GO.MenuItem -> position is undefined';
	}

	this.clickCallback = function() { console.log('default callback'); }

	SCG.GO.GO.call(this,prop);
	this.id = 'MenuItem' + (SCG.GO.MenuItem.counter++);
	this.items = [];
	this.parent = undefined;
	this.itemsGap = 5;
	
}

SCG.GO.MenuItem.counter = 0;
SCG.GO.MenuItem.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.MenuItem.prototype.constructor = SCG.GO.MenuItem;

SCG.GO.MenuItem.prototype.internalRender = function(){ 
	if(this.mouseOver)
	{
		this.renderSelectBox();
	}
}

SCG.GO.MenuItem.prototype.internalUpdate = function(){ 
	if(this.mouseOver && SCG.gameControls.mousestate.click.isClick)
	{
		this.clickCallback(this);
		// SCG.defenderMenu.shouldRenderMenu = false;
		// SCG.defenderMenu.clicked = true;
	}
}