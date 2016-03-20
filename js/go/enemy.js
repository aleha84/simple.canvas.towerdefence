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
	render: function(){
		for(var p = 0; p < this.paths.length; p++)
		{
			SCG.context.beginPath();
			for(var pi = 0; pi < this.paths[p].length-1; pi++){
				SCG.context.moveTo(this.paths[p][pi].x, this.paths[p][pi].y);
				SCG.context.lineTo(this.paths[p][pi+1].x, this.paths[p][pi+1].y);
			}
			SCG.context.lineWidth = 2;
			SCG.context.strokeStyle = 'blue';
			SCG.context.stroke();
		}
	},
	paths: [
		[new Vector2(500,20), new Vector2(400,50), new Vector2(350,100), new Vector2(300,150), new Vector2(250,190), new Vector2(120,240), new Vector2(80,190), new Vector2(-20,150)],
		[new Vector2(500,270), new Vector2(380,240), new Vector2(340,200), new Vector2(300,150), new Vector2(240,100), new Vector2(125,60), new Vector2(80,100), new Vector2(-20,150)],
		[new Vector2(500,150), new Vector2(420,140), new Vector2(300,40), new Vector2(220,90), new Vector2(160,150), new Vector2(80,190), new Vector2(-20,150)],
		[new Vector2(500,150), new Vector2(420,140), new Vector2(300,250), new Vector2(190,200), new Vector2(160,150), new Vector2(80,100), new Vector2(-20,150)]
	],
	show: false
}

SCG.EnemySpawner = {
	enemySoldiers: {
		currentSpawnDelay : 1000,
		originSpawnDelay : 1000,
		currentCount: 0,
		maxCount : 35,
		spawner: function(){
			var path = SCG.GO.EnemyPaths.getRandomPath();
			SCG.go.push(new SCG.GO.EnemySoldier({position: path.shift().clone(), path: path}));
		}
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
				entry.spawner();
			}
		}
	}
}

SCG.GO.EnemySoldier = function(prop)
{
	if(prop.position === undefined)
	{
		throw 'SCG.GO.EnemySoldier -> position is undefined';
	}

	if(prop.size == undefined){ prop.size = new Vector2(10,10); }
	if(prop.maxHealth == undefined){ prop.maxHealth = 5; }
	SCG.GO.GO.call(this,prop);

	//overriding defaults and props
	this.img = SCG.images.enemy_soldier;
	this.speed = 0.5;
	this.randomizeDestination = true;
	this.randomizeDestinationRadius = 15;
	this.updatePlaceable = true;
	this.hasPlaceable = true;
	this.id = 'EnemySoldier' + (SCG.GO.EnemySoldier.counter++);
	this.side = 2;
	this.isDrawingHealthBar = true;

	// SCG.Placeable.set(this);
	 SCG.Placeable.enemyUnits[this.id] = this;
}

SCG.GO.EnemySoldier.counter = 0;
SCG.GO.EnemySoldier.prototype = Object.create( SCG.GO.GO.prototype );
SCG.GO.EnemySoldier.prototype.constructor = SCG.GO.EnemySoldier;

SCG.GO.EnemySoldier.prototype.beforeDead = function(){
	SCG.GO.Remains.types.getObject('soldier', this.position.clone());
}
