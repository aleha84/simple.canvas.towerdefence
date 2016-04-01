SCG.src = {
	background: 'content/images/background.png',
	test: 'content/images/test.jpg',
	emptyDefencePoint: 'content/images/emptyDefencePoint.png',
	cross: 'content/images/cross.png',
	check: 'content/images/check.png',
	upgrade: 'content/images/upgrade.png',
	wooden_fence: 'content/images/wooden_fence.png',
	stone_barrier: 'content/images/stone_barrier.png',
	debrish_defence: 'content/images/debrish_defence.png',
	placeholder: 'content/images/placeholder.png',
	defender_soldier: 'content/images/defender_soldier.png',
	enemy_soldier: 'content/images/enemy_soldier.png',
	enemy_large: 'content/images/enemy_large.png',
	add_soldier: 'content/images/add_soldier.png',
	add_gunner: 'content/images/add_gunner.png',
	add_sniper: 'content/images/add_sniper.png',
	add_rpg: 'content/images/add_rpg.png',
	'add_machine-gunner': 'content/images/add_machine_gunner.png',
	remove_gunner: 'content/images/remove_gunner.png',
	remove_sniper: 'content/images/remove_sniper.png',
	remove_rpg: 'content/images/remove_rpg.png',
	'remove_machine-gunner': 'content/images/remove_machine_gunner.png',
	explosion_sheet: 'content/images/explosionSheet.png',
	soldier_remains: 'content/images/soldierremains.png',
	rifle: 'content/images/rifle.png',
	sniper: 'content/images/sniper.png',
	rpg: 'content/images/rpg.png',
	machine_gun: 'content/images/machine_gun.png',
	level_up: 'content/images/levelUp.png',
	money: 'content/images/money.png',
	level: 'content/images/level.png',
	progressBarHolder: 'content/images/progressBarHolder.png',
	progressBarInner: 'content/images/progressBarInner.png',
	info_panel: 'content/images/infoPanel.png',
	button_inactive: 'content/images/button_inactive.png',
	button_active: 'content/images/button_active.png',
	button_selected: 'content/images/button_selected.png',
	button_selected_blink: 'content/images/button_selected_blink.png',
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

	SCG.gameControls.selectedGOs = [];

	initializer(function(){
		SCG.gameControls.orientationChangeEventInit();
		SCG.GO.DefenderState.init();

		for(var i=0;i<SCG.GO.DefenderState.positions.length;i++){
			SCG.go.push(new SCG.GO.Defender({position: SCG.GO.DefenderState.positions[i]}));
		}

		SCG.buttons.init();

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

	SCG.gameLogics.doPauseWork(now);

	SCG.gameControls.mousestate.doClickCheck();

	SCG.EnemySpawner.doWork(now);

	//draw background
	SCG.context.drawImage(SCG.images.background,0,0,SCG.battlefield.width,SCG.battlefield.height);

	var i = SCG.go.length;
	while (i--) {
		SCG.go[i].update(now);
		SCG.go[i].render();
		if(!SCG.go[i].alive){
			var deleted = SCG.go.splice(i,1);
		}
	}

	SCG.buttons.update(now);

	SCG.defenderMenu.doUpdateWork(now);

	SCG.difficulty.render();

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