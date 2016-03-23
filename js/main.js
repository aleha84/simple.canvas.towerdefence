SCG.src = {
	background: 'content/images/background.png',
	test: 'content/images/test.jpg',
	emptyDefencePoint: 'content/images/emptyDefencePoint.png',
	cross: 'content/images/cross.png',
	check: 'content/images/check.png',
	upgrade: 'content/images/upgrade.png',
	wooden_fence: 'content/images/wooden_fence.png',
	placeholder: 'content/images/placeholder.png',
	defender_soldier: 'content/images/defender_soldier.png',
	enemy_soldier: 'content/images/enemy_soldier.png',
	add_soldier: 'content/images/add_soldier.png',
	add_gunner: 'content/images/add_gunner.png',
	add_sniper: 'content/images/add_sniper.png',
	add_rpg: 'content/images/add_rpg.png',
	remove_gunner: 'content/images/remove_gunner.png',
	remove_sniper: 'content/images/remove_sniper.png',
	remove_rpg: 'content/images/remove_rpg.png',
	explosion_sheet: 'content/images/explosionSheet.png',
	soldier_remains: 'content/images/soldierremains.png',
	rifle: 'content/images/rifle.png',
	level_up: 'content/images/levelUp.png'
}

SCG.images = {
}

$(document).ready(function(){
	if(!SCG.canvas)
	{
		var c = $('<canvas />',{
			width: SCG.battlefield.width,
			height: SCG.battlefield.height
		});
		c.attr({'width':SCG.battlefield.width,'height':SCG.battlefield.height,id:SCG.canvasId});
		$(document.body).append(c);
		SCG.canvas = c.get(0);
		SCG.context = SCG.canvas.getContext('2d');

		var fulsscreenToggleButton = $('<div />',
			{
				class: 'button fulscreenbutton',
				on: {
					click: function(){ screenfull.toggle(document.documentElement); $(this).toggleClass('exit'); }
				}
			});

		$(document.body).append(fulsscreenToggleButton);
		SCG.debugger.setValue('App started');
	}

	SCG.nonplayableGo = [];
	SCG.gameControls.selectedGOs = [];

	initializer(function(){
		SCG.gameControls.orientationChangeEventInit();
		SCG.GO.DefenderState.init();

		// var testGo = new SCG.GO.GO({
		// 	img : SCG.images.test,
		// 	position: new Vector2(200,200),
		// 	id : 'test',
		// 	size: new Vector2(20,20),
		// 	speed: 0.5,
		// 	path: [new Vector2(50,50), new Vector2(100,50), new Vector2(100,100), new Vector2(50,100)],
		// 	internalUpdate: function(){ 
		// 		if(this.destination == undefined)
		// 		{
		// 			// this.destination = new Vector2(getRandom(12,SCG.battlefield.default.width-12),getRandom(12, SCG.battlefield.default.height));
		// 			// this.direction = this.position.direction(this.destination);	
		// 			this.setDead();
		// 		}
		// 	 }
		// });

		//SCG.go.push(new SCG.GO.Enemy({position: new Vector2}));

		for(var i=0;i<SCG.GO.DefenderState.positions.length;i++){
			SCG.go.push(new SCG.GO.Defender({position: SCG.GO.DefenderState.positions[i]}));
		}

		// var testDefender = new SCG.GO.Defender({
		// 	position: new Vector2(getRandom(12,SCG.battlefield.default.width-12),getRandom(12, SCG.battlefield.default.height)),
		// 	size: new Vector2(30,30),
		// });


		// SCG.go.push(testDefender);

		// for(var i = 0; i< 10; i++)
		// {
		// 	var testLight =  new SCG.GO.Light({
		// 		position: new Vector2(getRandom(12,SCG.battlefield.default.width-12),getRandom(12, SCG.battlefield.default.height)),
		// 		radius: getRandom(50,100),
		// 	});
		// 	SCG.go.push(testLight);	
		// }

		SCG.animate();
	});
});

SCG.animate = function() {
    SCG.draw();
    requestAnimationFrame( SCG.animate );   
}

SCG.draw = function(){
	var now = new Date;

	SCG.gameControls.mousestate.doClickCheck();

	SCG.EnemySpawner.doWork(now);

	//draw background
	SCG.context.drawImage(SCG.images.background,0,0,SCG.battlefield.width,SCG.battlefield.height);
	if((!SCG.gameLogics.isPaused || (SCG.gameLogics.isPaused && SCG.gameLogics.isPausedStep)) && !SCG.gameLogics.gameOver){
		// clear visible go array
		SCG.visibleGo = [];	
	}

	var i = SCG.go.length;
	while (i--) {
		SCG.go[i].update(now);
		SCG.go[i].render();
		if(!SCG.go[i].alive){
			var deleted = SCG.go.splice(i,1);
		}
	}

	var ni = SCG.nonplayableGo.length;
	while (ni--) {
		SCG.nonplayableGo[ni].update(now);
		SCG.nonplayableGo[ni].render();
		if(!SCG.nonplayableGo[ni].alive){
			var deleted = SCG.nonplayableGo.splice(ni,1);
		}
	}

	if(SCG.Placeable.show){
		SCG.Placeable.render();
	}
	if(SCG.GO.EnemyPaths.show){
		SCG.GO.EnemyPaths.render();
	}

	if(SCG.gameLogics.isPausedStep)
	{
		SCG.gameLogics.isPausedStep =false;
	}

	SCG.frameCounter.doWork(now);
}

SCG.frameCounter = {
	lastTimeCheck : new Date,
	checkDelta: 1000,
	prevRate: 0,
	current: 0,
	renderConsumption:
	{
		begin: new Date,
		end: new Date,
	},
	visibleCount: 0,
	draw: function(){
		SCG.context.save();     
		SCG.context.fillStyle = "red";
		SCG.context.font = "48px serif";
  		SCG.context.fillText(this.prevRate, SCG.battlefield.width-60, 40);
  		SCG.context.font = "24px serif";
  		SCG.context.fillText(this.visibleCount, SCG.battlefield.width-60, 80);
  		if(SCG.gameLogics.messageToShow != '')
  		{
  			SCG.context.fillStyle = "black";
			SCG.context.font = "24px serif";
  			SCG.context.fillText(SCG.gameLogics.messageToShow, 10, 40);
  		}
  		SCG.frameCounter.visibleCount = 0;
		SCG.context.restore(); 
	},
	doWork : function(now)
	{
		if(now - this.lastTimeCheck > this.checkDelta)
		{
			this.prevRate = this.current;
			this.current = 0;
			this.lastTimeCheck = now;
		}
		else{
			this.current++;
		}

		this.draw();
	}
}