SCG.src = {
	background: 'content/images/background.jpg',
	test: 'content/images/test.jpg',
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
		c.attr({'width':SCG.battlefield.width,'height':SCG.battlefield.height});
		$(document.body).append(c);
		SCG.canvas = c.get(0);
		SCG.context = SCG.canvas.getContext('2d');
	}

	SCG.nonplayableGo = [];
	SCG.gameControls.selectedGOs = [];

	initializer(function(){
		var testGo = new SCG.GO.GO({
			img : SCG.images.test,
			position: new Vector2(200,200),
			id : 'test',
			radius: 20,
			speed: 3,
			internalUpdate: function(){ 
				if(this.destination == undefined)
				{
					this.destination = new Vector2(getRandom(12,SCG.battlefield.width-12),getRandom(12, SCG.battlefield.height));
					this.direction = this.position.direction(this.destination);	
				}
			 }
		});

		SCG.go.push(testGo);

		SCG.gameControls.orientationChangeEventInit();

		SCG.animate();
	});
});

SCG.animate = function() {
    SCG.draw();
    requestAnimationFrame( SCG.animate );   
}

SCG.draw = function(){
	var now = new Date;

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