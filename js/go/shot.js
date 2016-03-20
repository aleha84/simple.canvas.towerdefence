SCG.GO.Shot = function(prop)
{
	if(prop.side === undefined) {
		throw 'SCG2.GO.Shot -> side is undefined';	
	}
	if(prop.position === undefined)
	{
		throw 'SCG2.GO.Shot -> position is undefined';
	}
	if(prop.destination === undefined) {
		throw 'SCG2.GO.Shot -> destination is undefined';	
	}
	if(prop.damage == undefined){ prop.damage = 1; }
	if(prop.size == undefined){ prop.size = new Vector2(1,1); }
	if(prop.speed == undefined){ prop.speed = 10; }
	if(prop.strokeColor === undefined) { this.strokeColor = '#ff0000';}
	if(prop.lineWidth  === undefined) { this.lineWidth  = 2;}
	SCG.GO.GO.call(this,prop);

	//overriding defaults and props
	this.id = 'Shot' + (SCG.GO.Shot.counter++);
	this.setDeadOnDestinationComplete = true;
	this.setDestination(this.destination);
}

SCG.GO.Shot.counter = 0;
SCG.GO.Shot.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.Shot.prototype.constructor = SCG.GO.Shot;

SCG.GO.Shot.ShotTypes = {
	simple: {
		damage: 1,
		speed: 10,
		explosionType: 'tinyExplosion'
	},
	sniper: {
		damage: 50,
		speed: 100,
		explosionType: 'tinyExplosion'
	},
	getShot: function(type, side, position, destination){
		SCG.go.push(new SCG.GO.Shot($.extend({},{
			side: side,
			position: position,
			destination: destination
		}, SCG.GO.Shot.ShotTypes[type])));
	}
}

SCG.GO.Shot.prototype.internalRender = function(){
	SCG.context.beginPath();
	SCG.context.lineWidth = this.lineWidth;
	SCG.context.strokeStyle = this.strokeColor;
	SCG.context.moveTo(this.renderPosition.x, this.renderPosition.y);
	var lineTo = this.renderPosition.add(this.direction.mul(this.speed*SCG.gameControls.scale.times),true);
	SCG.context.lineTo(lineTo.x, lineTo.y);
	SCG.context.stroke();
}

SCG.GO.Shot.prototype.internalPreUpdate = function(){
	if(!this.alive){
		return false;
	}

	var units = this.side == 1 ? SCG.Placeable.enemyUnits : SCG.Placeable.playerUnits;
	var segment = { begin: this.position.clone(), end: this.position.add(this.direction.mul(this.speed), true), lenght: this.speed};
	for(var unitId in units) {
		if(units.hasOwnProperty(unitId)){
			var unit = units[unitId];
			
			if(this.position.distance(unit.position) < (this.speed*3) 
				&& segmentIntersectBox(segment , unit.box))
			{
				var hitPoint = segment.begin;
				for(var ic = 5;ic>0; ic--){
					if(unit.box.isPointInside(segment.begin)){
						hitPoint = segment.begin;
						break;
					}
					else if(unit.box.isPointInside(segment.end)){
						hitPoint = segment.end;
						break;
					}
					else{
						var nLength = segment.lenght/2;
						var middle = segment.begin.add(this.direction.mul(nLength),true);
						segment = segment.begin.distance(unit.position) <= segment.end.distance(unit.position) 
							?  { begin : segment.begin, end : middle, lenght : nLength } 
							: { begin : middle, end : segment.end, lenght : nLength };
						hitPoint = segment.begin;
					}
				}
				this.setDead();
				SCG.Animations.createObject(this.explosionType, hitPoint);
				unit.hitted(this.damage);
				break;
			}
		}
	}

	// for(var i = 0;i < this.speed; i++){
	// 	var step = this.position.add(this.direction.mul(i), true);
	// 	var index = Math.round(step.x) + 'x' + Math.round(step.y);
	// 	if(SCG.Placeable.battlefield[index] != undefined){
	// 		var hitted = false;
	// 		for (var unitId in SCG.Placeable.battlefield[index]) {	
	// 			if (SCG.Placeable.battlefield[index].hasOwnProperty(unitId)) {
	// 				var unit = SCG.Placeable.battlefield[index][unitId];
	// 				if(unit.side != this.side){
	// 					unit.hitted();
	// 					hitted = true;
	// 				}
	// 			}
	// 		}
	// 		if(hitted){
	// 			this.setDead();
	// 			SCG.Animations.createObject(SCG.Animations.types.smallExplosion, step.clone());
	// 			break;
	// 		}
	// 	}
	// }
}