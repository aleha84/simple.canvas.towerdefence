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

	this.target = undefined;
	this.range = 75;
	this.side = this.parent.side;
	this.shotType = 'simple'; // todo defender soldiers types

	this.fireTimer = {
		lastTimeWork: new Date,
		delta : 0,
		currentDelay: 300,
		originDelay: 300,
		doWorkInternal : this.fire,
		context: this
	}

	this.aimingTimer = {
		lastTimeWork: new Date,
		delta : 0,
		currentDelay: 500,
		originDelay: 500,
		doWorkInternal : this.aiming,
		context: this	
	}
}

SCG.GO.DefenderSoldier.counter = 0;
SCG.GO.DefenderSoldier.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.DefenderSoldier.prototype.constructor = SCG.GO.DefenderSoldier;

SCG.GO.DefenderSoldier.prototype.aiming = function(){
	var units = this.side == 1 ? SCG.Placeable.enemyUnits : SCG.Placeable.playerUnits;
	var unitsInRange = [];
	for(var unitId in units) {
		if(units.hasOwnProperty(unitId)){
			var unit = units[unitId];
			var distance = this.position.distance(unit.position);
			if(distance <= this.range){
				unitsInRange.push({distance: distance, unit: unit});
			}
		}
	}

	if(unitsInRange.length > 0){
		if(unitsInRange.length == 1){
			this.target = unitsInRange[0].unit;
		}
		else{
			for(var i = 0; i< this.parent.defenderSoldiers.length; i++)
			{
				if(unitsInRange.length == 1){
					break;
				}
				var ds = this.parent.defenderSoldiers[i];
				if(ds == this){
					continue;
				}

				if(ds.target != undefined){
					var j = unitsInRange.length;
					while(j--){
						if(unitsInRange[j].unit == ds.target){
							var deleted = unitsInRange.splice(j,1);
						}
					}
				}
			}

			//find closest
			var j = unitsInRange.length;
			var closest = unitsInRange[0];
			while(j--){
				if(unitsInRange[j].distance < closest.distance){
					closest = unitsInRange[j];
				}
			}

			this.target = closest.unit;
		}
	}
}

SCG.GO.DefenderSoldier.prototype.fire = function(){
	if(this.target == undefined){
		return;
	}

	var targetNextPosition = this.target.position.add(this.target.direction.mul(this.target.speed* ((this.position.distance(this.target.position)) / SCG.GO.Shot.ShotTypes[this.shotType].speed) ),true);
	SCG.GO.Shot.ShotTypes.getShot(this.shotType, this.side, this.position.clone(), targetNextPosition.clone());
	// SCG.go.push(new SCG.GO.Shot({
	// 	side: this.side,
	// 	position: this.position.clone(),
	// 	destination: this.target.position.clone()
	// }));
}

SCG.GO.DefenderSoldier.prototype.internalRender = function(){
	if(this.type == 'gunner'){
		SCG.context.drawImage(SCG.images.rifle, 
				(this.renderPosition.x ), 
				(this.renderPosition.y), 
				this.renderSize.x/2, 
				this.renderSize.y/2);	
	}
}

SCG.GO.DefenderSoldier.prototype.internalUpdate = function(now){
	if(this.target != undefined){
		if(!this.target.alive || this.position.distance(this.target.position) > this.range){
			this.target = undefined;
		}
		else{
			doWorkByTimer(this.fireTimer, now);
		}
	}

	if(this.target == undefined){
		doWorkByTimer(this.aimingTimer, now);
	}
}