SCG.GO.DefenderSoldier = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG.GO.DefenderSoldier -> position is undefined';
	}

	if(prop.size == undefined){ prop.size = new Vector2(10,10); }
	if(prop.maxHealth == undefined){ prop.maxHealth = 50; }
	SCG.GO.GO.call(this,prop);
	this.img = SCG.images.defender_soldier;

	this.id = 'DefenderSoldier' + (SCG.GO.DefenderSoldier.counter++);

	this.target = undefined;
	this.originRange = 75;
	this.range = 75;
	this.side = this.parent.side;

	this.originScatter = 1;
	this.currentScatter = 1;

	this.penetration = 1;
	this.damageModifier = 1;
	this.originDamageModifier = 1;
	this.explosionRadiusModifier = 1;
	this.originExplosionRadiusModifier = 1;
	this.level = 0;
	this.prevLevelExpNeed = 0;
	this.nextLevelExpNeed= 100;
	this.nextLevelExpStep = 100;
	this.currentExperience = 0;
	this.weaponImg = undefined;

	this.fireTimer = {
		lastTimeWork: new Date,
		delta : 0,
		currentDelay: 300,
		originDelay: 0,
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

	switch(this.type){
		case 'gunner':
			this.originScatter = 20;
			this.originFireDelay = 750;
			this.originRange = 75;
			this.weaponImg = SCG.images.rifle;
			break;
		case 'sniper':
			this.originScatter = 5;
			this.originFireDelay = 2000;
			this.originRange = 150;
			this.weaponImg = SCG.images.sniper;
			break;
		case 'rpg':
			this.originScatter = 10;
			this.originFireDelay = 6000;
			this.originRange = 110;
			this.weaponImg = SCG.images.rpg;
			break;
		default:
			break;
	}

	this.range = this.originRange;
	this.currentScatter = this.originScatter;
	this.fireTimer.originDelay = this.originFireDelay;
}

SCG.GO.DefenderSoldier.counter = 0;
SCG.GO.DefenderSoldier.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.DefenderSoldier.prototype.constructor = SCG.GO.DefenderSoldier;

SCG.GO.DefenderSoldier.prototype.getExperience = function(experience){
	this.currentExperience += experience;
	if(this.currentExperience >= this.nextLevelExpNeed){
		this.levelUp();
	}
}

SCG.GO.DefenderSoldier.prototype.levelUp = function(){
	SCG.GO.Remains.types.getObject('levelUp', this.position.add(new Vector2(0, -this.size.y/2), true), false);

	this.level++;
	this.currentExperience -= this.nextLevelExpNeed;
	this.prevLevelExpNeed = this.nextLevelExpNeed;
	this.nextLevelExpNeed = this.prevLevelExpNeed + this.level*this.nextLevelExpStep;

	this.maxHealth += (25 * this.level);
	this.health = this.maxHealth;

	switch(this.type){
		case 'gunner':
			switch(getRandomInt(1,4)){
				case 1:
					this.currentScatter = this.originScatter * (Math.pow(0.91, this.level));
					break;
				case 2:
					this.fireTimer.originDelay = this.originFireDelay * (Math.pow(0.9, this.level));
					break;
				case 3:
					this.damageModifier = this.originDamageModifier  + (0.5 * this.level);
					break;
				case 4:
					this.range = this.originRange  + (7.5 * this.level);
					break;
				default:
					break;
			}
			break;
		case 'sniper':
			switch (getRandomInt(1,3)){
				case 1:
					this.fireTimer.originDelay = this.originFireDelay * (Math.pow(0.9, this.level));
					break;
				case 2:
					this.range = this.originRange  + (50 * this.level);
					break;
				case 3: 
					this.penetration++;
					break;
			}
			break;
		case 'rpg':
			switch (getRandomInt(1,3)){
				case 1:
					this.fireTimer.originDelay = this.originFireDelay * (Math.pow(0.9, this.level));
					break;
				case 2:
					this.range = this.originRange  + (10 * this.level);
					break;
				case 3:
					this.damageModifier = this.originDamageModifier  + (0.25 * this.level);
					break;
				case 4:
					this.explosionRadiusModifier = this.originExplosionRadiusModifier  + (0.2 * this.level);
					break;
			}
		default:
			break;
	}
}

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

	var targetNextPosition = this.target.position
		.add(this.target.direction.mul(this.target.speed* ((this.position.distance(this.target.position)) / SCG.GO.Shot.ShotTypes[this.type].speed) ),true)
		.add(new Vector2(getRandom(-this.originScatter, this.originScatter), getRandom(-this.originScatter, this.originScatter)),true);

	if(this.type == 'sniper'){
		targetNextPosition = this.position.add(this.position.direction(targetNextPosition).mul(this.range), true);
	}
	
	SCG.GO.Shot.ShotTypes.getShot(this, targetNextPosition.clone());
}

SCG.GO.DefenderSoldier.prototype.internalRender = function(){
	
	if(this.weaponImg != undefined){
		SCG.context.drawImage(this.weaponImg, 
				(this.renderPosition.x - this.renderSize.x * (1/6) ), 
				(this.renderPosition.y - this.renderSize.y * (1/6)), 
				this.renderSize.x* 2/3, 
				this.renderSize.y* 2/3);	
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