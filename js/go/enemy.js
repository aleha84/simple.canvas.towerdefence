SCG.GO.EnemyPaths = {
	getRandomPath: function(){
		return this.getPath(getRandomInt(0, SCG.GO.EnemyPaths.paths.length-1));
	},
	getPath: function(index) {
		var path = this.paths[index];
		var newPath = [];
		for(var i = 0; i<path.length;i++){
			newPath.push(path[i].clone());
		}
		return newPath;
	},
	paths: [
		[new Vector2(500,50), new Vector2(400,100), new Vector2(300,50), new Vector2(200,120), new Vector2(100,60), new Vector2(-100,50)]
	]
}

SCG.EnemySpawner = {
	enemySoldiers: {
		currentSpawnDelay : 1000,
		originSpawnDelay : 1000,
		currentCount: 0,
		maxCount : 3
	},
	lastTimeWork : new Date,
	delta: 0,
	doWork: function(now){
		if(SCG.gameLogics.isPaused){
			this.lastTimeWork = now;
			this.delta = 0;
			return;
		}

		this.delta = now - this.lastTimeWork;
		this.doWorkInternal(this.enemySoldiers, this.delta);
		this.lastTimeWork = now;
	},
	doWorkInternal: function(entry, delta){
		if(entry.currentCount < entry.maxCount){
			entry.currentSpawnDelay-=delta;
			if(entry.currentSpawnDelay < 0){
				entry.currentSpawnDelay = entry.originSpawnDelay;
				entry.currentCount++;
				SCG.go.push(new SCG.GO.EnemySoldier({position: new Vector2}));
			}
		}
	}
}

SCG.GO.EnemySoldier = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG2.GO.EnemySoldier -> position is undefined';
	}

	if(prop.size == undefined){ prop.size = new Vector2(10,10); }
	SCG.GO.GO.call(this,prop);

	//overriding defaults and props
	this.img = SCG.images.enemy_soldier;
	this.speed = 1;
	this.path = SCG.GO.EnemyPaths.getRandomPath();
	this.position = this.path.shift().clone();
	this.randomizeDestination = true;
	this.randomizeDestinationRadius = 20;
	this.updatePlaceable = true;
	this.hasPlaceable = true;
	this.id = 'EnemySoldier' + (SCG.GO.EnemySoldier.counter++);
	SCG.Placeable.set(this);
	SCG.Placeable.enemyUnits[this.id] = this;
}

SCG.GO.EnemySoldier.counter = 0;
SCG.GO.EnemySoldier.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.EnemySoldier.prototype.constructor = SCG.GO.EnemySoldier;

// SCG.GO.EnemySoldier.prototype.getPath = function(path){
// 	var newPath = [];
// 	for(var i = 0; i<path.length;i++){
// 		newPath.push(path[i].clone());
// 	}
// 	this.path = newPath;
// }