SCG.GO.DefenderSoldier = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG2.GO.DefenderSoldier -> position is undefined';
	}

	if(prop.size == undefined){ prop.size = new Vector2(10,10); }
	SCG.GO.GO.call(this,prop);
	this.img = SCG.images.defender_soldier;

	this.id = 'DefenderSoldier' + (SCG.GO.DefenderSoldier.counter++);
}

SCG.GO.DefenderSoldier.counter = 0;
SCG.GO.DefenderSoldier.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.DefenderSoldier.prototype.constructor = SCG.GO.DefenderSoldier;