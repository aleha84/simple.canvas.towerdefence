var SCG = {};

SCG.battlefield = {
	default: {
		width: 500,
		height: 300
	},
	width: 500,
	height: 300,
};

SCG.canvas = undefined;
SCG.canvasId = "mainCanvas";
SCG.canvasIdSelector = "#"+SCG.canvasId;
SCG.context = undefined;
SCG.gameLogics = {
	isPaused: false,
	isPausedStep: false,
	gameOver: false,
	drawBoundings: true,
	fillBoundings: false,
	wrongDeviceOrientation: false,
	messageToShow: '',
	isMobile: false
}

SCG.difficulty = {
	level: 0,
	enemyKilled: 0,
	enemyKilledToNextLevel: 15,
	enemyKilledToNextLevelStep: 15,
	enemyKilledToNextLevelPrev: 0,
	addKill: function(){
		this.enemyKilled++;
		if(this.enemyKilled >= this.enemyKilledToNextLevel){
			this.level++;
			this.enemyKilledToNextLevelPrev = this.enemyKilledToNextLevel;
			this.enemyKilledToNextLevel = this.enemyKilledToNextLevelPrev + this.enemyKilledToNextLevelStep*(this.level+1);	
			SCG.EnemySpawner.levelUp(this.level);
		}
	},
	money: 150,
	costs: {
		gunner: {
			base: 50,
			getCost: function() {
				return this.base + SCG.difficulty.costs.getAmountOf('gunner')*10;
			},
			getRefund: function(level) {
				return (this.base/2) + level * 5;
			}
		},
		sniper: {
			base: 100,
			getCost: function() {
				return this.base + SCG.difficulty.costs.getAmountOf('sniper')*40;
			},
			getRefund: function(level) {
				return (this.base/2) + level * 20;
			}
		},
		rpg: {
			base: 200,
			getCost: function() {
				return this.base + SCG.difficulty.costs.getAmountOf('rpg')*100;
			},
			getRefund: function(level) {
				return (this.base/2) + level * 20;
			}
		},
		getAmountOf: function(type){
			var result = 0;
			for(var unitId in SCG.Placeable.playerUnits) {
				if(SCG.Placeable.playerUnits.hasOwnProperty(unitId)){
					var unit = SCG.Placeable.playerUnits[unitId];
					if(unit.defenderSoldiers.length > 0){
						for(var i = 0;i<unit.defenderSoldiers.length;i++){
							if(unit.defenderSoldiers[i].type == type){
								result++;
							}
						}
					}
				}
			}

			return result;
		}
	},
	infoPanel: {
		width: 150,
		height: 50,
		fontSize: 15,
	},
	render: function(){

		var panelTopLeft = new Vector2(0, SCG.battlefield.height - this.infoPanel.height * SCG.gameControls.scale.times);
		SCG.context.drawImage(SCG.images.info_panel,
			panelTopLeft.x,
			panelTopLeft.y,
			this.infoPanel.width * SCG.gameControls.scale.times,
			this.infoPanel.height * SCG.gameControls.scale.times);

		SCG.context.drawImage(SCG.images.money,
			panelTopLeft.x + 20* SCG.gameControls.scale.times,
			panelTopLeft.y + 10* SCG.gameControls.scale.times,
			15 * SCG.gameControls.scale.times,
			15 * SCG.gameControls.scale.times);

		SCG.context.drawImage(SCG.images.level,
			panelTopLeft.x + 20* SCG.gameControls.scale.times,
			panelTopLeft.y + 27* SCG.gameControls.scale.times,
			15 * SCG.gameControls.scale.times,
			15 * SCG.gameControls.scale.times);


		SCG.context.font = this.infoPanel.fontSize * SCG.gameControls.scale.times + "px Arial";
		SCG.context.fillStyle = 'gold';
		SCG.context.fillText(SCG.difficulty.money, panelTopLeft.x + 38* SCG.gameControls.scale.times, panelTopLeft.y + 23* SCG.gameControls.scale.times);

		SCG.context.fillStyle = 'gray';
		SCG.context.fillText(SCG.difficulty.level+1, panelTopLeft.x + 38* SCG.gameControls.scale.times, panelTopLeft.y + 40* SCG.gameControls.scale.times);

		SCG.context.drawImage(SCG.images.progressBarHolder,
			panelTopLeft.x + 60* SCG.gameControls.scale.times,
			panelTopLeft.y + 29* SCG.gameControls.scale.times,
			65 * SCG.gameControls.scale.times,
			12 * SCG.gameControls.scale.times);

		SCG.context.drawImage(SCG.images.progressBarInner,
			panelTopLeft.x + 60.5* SCG.gameControls.scale.times,
			panelTopLeft.y + 30* SCG.gameControls.scale.times,
			(64.2 * SCG.gameControls.scale.times) * ((this.enemyKilled - this.enemyKilledToNextLevelPrev) / (this.enemyKilledToNextLevel - this.enemyKilledToNextLevelPrev)),
			9.5 * SCG.gameControls.scale.times);
	}
}

SCG.go = [];
SCG.nonplayableGo = [];
SCG.visibleGo = [];

SCG.debugger = 
{
	el: $('.debugger'),
	initialized : false,
	init: function() { 
		this.el = $('.debugger'),
		this.initialized = true;
	},
	clear : function() { this.setValue('') },
	setValue : function(value) { 
		if(!this.initialized)
		{
			this.init();	
		}
		this.el.html(value); 
	}
}

SCG.defenderMenu = {
	menu : undefined,
	shouldRenderMenu: false,
	clicked: false
}

SCG.gameControls = {
	scale:
	{
		times: 1
	},
	mousestate : {
		position: new Vector2,
		delta: new Vector2,
		leftButtonDown: false,
		rightButtonDown: false,
		middleButtonDown: false,
		timer : undefined,
		reset: function(){
			this.leftButtonDown = false;
            this.rightButtonDown = false;
            this.middleButtonDown = false;
		},
		stopped : function(){
			SCG.gameControls.mousestate.delta = new Vector2;
		},
		toString: function(){
			return 'position: '+this.position.toString()+'<br/>leftButtonDown: ' + this.leftButtonDown;
		},
		doClickCheck: function() {
			if(this.leftButtonDown)
			{
				this.click.prevStateDown = true;
			}
			else if(!this.leftButtonDown && this.click.prevStateDown)
			{
				this.click.prevStateDown = false;
				this.click.isClick = true;

				// SCG.defenderMenu.menu = undefined;
				// SCG.defenderMenu.shouldRenderMenu = false;
			}
			else if(this.click.isClick)
			{
				this.click.isClick = false;
			}
		},
		click: {
			prevStateDown: false,
			isClick : false
		}
	},
	keyboardstate: {
		altPressed : false,
		shiftPressed : false,
		ctrlPressed: false
	},
	selectedGOs : [],
	mouseDown: function(event){
		if(event.type == 'touchstart')
		{
			if(event.originalEvent.changedTouches != undefined && event.originalEvent.changedTouches.length == 1)
			{
				SCG.gameControls.mousestate.leftButtonDown = true;
			}
		}
		else{
			switch (event.which) {
		        case 1:
		            SCG.gameControls.mousestate.leftButtonDown = true;
		            break;
		        case 2:
		            SCG.gameControls.mousestate.middleButtonDown = true;
		            break;
		        case 3:
		            SCG.gameControls.mousestate.rightButtonDown = true;
		            break;
		        default:
		            SCG.gameControls.mousestate.reset();
		            break;
	    	}
		}
		
	},
	mouseOut: function(event){
		SCG.gameControls.mousestate.reset();
	},
	mouseUp: function(event){
		if(event.type == 'touchstart')
		{
			if(event.originalEvent.changedTouches != undefined && event.originalEvent.changedTouches.length == 1)
			{
				SCG.gameControls.mousestate.leftButtonDown = false;
			}
		}
		else{
			switch (event.which) {
		        case 1:
		            SCG.gameControls.mousestate.leftButtonDown = false;
		            break;
		        case 2:
		            SCG.gameControls.mousestate.middleButtonDown = false;
		            break;
		        case 3:
		            SCG.gameControls.mousestate.rightButtonDown = false;
		            break;
		        default:
		            SCG.gameControls.mousestate.reset();
		            break;
		    }
		}

		/*simple selection, without selection rectangle and checking for mouse buttons*/

		//clean current selected gos
		event.preventDefault();

		for (var i = SCG.gameControls.selectedGOs.length - 1; i >= 0; i--) {
			SCG.gameControls.selectedGOs[i].selected = false;
		};
		SCG.gameControls.selectedGOs = [];
	},
	mouseMove: function(event){
		var oldPosition = SCG.gameControls.mousestate.position.clone();
		var eventPos = pointerEventToXY(event);
		var offset = $(SCG.canvas).offset();
		SCG.gameControls.mousestate.position = new Vector2(eventPos.x - SCG.canvas.margins.left,eventPos.y - SCG.canvas.margins.top);
		SCG.gameControls.mousestate.delta = SCG.gameControls.mousestate.position.substract(oldPosition,true);

		SCG.debugger.setValue(SCG.gameControls.mousestate.toString());
		//console.log(SCG.gameControls.mousestate.position);
	},
	orientationChangeEventInit: function() {
		var that = this;
		$(window).on('orientationchange resize', function(e){
			that.graphInit();
		});

		SCG.gameLogics.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

		if(SCG.gameLogics.isMobile)
		{
			setTimeout( function(){ window.scrollTo(0, 1); }, 100 );
			$(document).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', function(e){
				that.graphInit();
			});
		}
		

		this.graphInit();
	},
	graphInit: function(){
		SCG.gameLogics.messageToShow = '';
		SCG.gameLogics.wrongDeviceOrientation = !window.matchMedia("(orientation: landscape)").matches;
		if(SCG.gameLogics.wrongDeviceOrientation) {
			SCG.gameLogics.messageToShow = 'wrong device orientation - portrait';
			return;
		}

		var width =  window.innerWidth;
		if(width < SCG.battlefield.default.width)
		{
			SCG.gameLogics.messageToShow = String.format('width lesser than {3} (width: {0}, iH: {1}, iW: {2})',width, window.innerHeight, window.innerWidth, SCG.battlefield.default.width);
			SCG.gameLogics.wrongDeviceOrientation = true;
			return;
		}
		// var proportions = SCG.gameLogics.isMobile ?  (window.innerHeight / window.innerWidth) : (window.innerWidth / window.innerHeight);
		// SCG.gameControls.scale.times = (width / SCG.battlefield.default.width) / proportions;

		var _width = $(window).width();
		var _height = $(window).height();
		var ratioX = _width /SCG.battlefield.default.width;
		var ratioY = _height / SCG.battlefield.default.height;

		SCG.gameControls.scale.times = Math.min(ratioX, ratioY); //_width > _height ? _height / SCG.battlefield.default.height : _width /SCG.battlefield.default.width;

		if(SCG.gameControls.scale.times < 1)
		{
			SCG.gameLogics.messageToShow = String.format('window is to small (width: {0}, height: {1})', _width, _height);
			SCG.gameLogics.wrongDeviceOrientation = true;
			return;
		}

		//var oldSize = new Vector2(SCG.battlefield.width, SCG.battlefield.height);

		SCG.battlefield.width = SCG.battlefield.default.width * SCG.gameControls.scale.times;
		SCG.battlefield.height = SCG.battlefield.default.height * SCG.gameControls.scale.times;

		//var sizeChanges = new Vector2(SCG.battlefield.width / oldSize.x, SCG.battlefield.height / oldSize.y);

		var mTop = 0;
		var mLeft = 0;
		if(SCG.battlefield.width < _width)
		{
			mLeft = Math.round((_width - SCG.battlefield.width)/2);
		}
		else if(SCG.battlefield.height < _height)
		{
			mTop = Math.round((_height - SCG.battlefield.height)/2);
		}

		$(SCG.canvas).attr({'width':SCG.battlefield.width,'height':SCG.battlefield.height})
		$(SCG.canvas).css({'width':SCG.battlefield.width,'height':SCG.battlefield.height});
		$(SCG.canvas).css({'margin-top': mTop });
		$(SCG.canvas).css({'margin-left': mLeft });
		SCG.canvas.width = SCG.battlefield.width;
		SCG.canvas.height = SCG.battlefield.height;
		SCG.canvas.margins = {
			top : mTop,
			left: mLeft
		};

		// var i = SCG.go.length;
		// while (i--) {
		// 	SCG.go[i].position = new Vector2(SCG.go[i].position.x * sizeChanges.x, SCG.go[i].position.y * sizeChanges.y);
		// }

		// var ni = SCG.nonplayableGo.length;
		// while (ni--) {
		// 	SCG.nonplayableGo[ni].update(now);
		// }
	},
	permanentEventInit : function (){
		var that = this;
		$(document).on('keydown',function(e){
			that.permanentKeyDown(e);
		});
		$(document).on('keyup',function(e){
			that.permanentKeyUp(e);
		});
		$(document).on('mousedown touchstart', SCG.canvasIdSelector,function(e){
			absorbTouchEvent(e);
			if(e.type == 'touchstart')
			{
				that.mouseMove(e);
			}
			that.mouseDown(e);
		});
		$(document).on('mouseup touchend', SCG.canvasIdSelector, function(e){
			absorbTouchEvent(e);
			that.mouseUp(e);
		});
		$(document).on('mouseout touchleave', SCG.canvasIdSelector, function(e){
			absorbTouchEvent(e);
			that.mouseOut(e);
		});
		$(document).on('mousemove touchmove', SCG.canvasIdSelector, function(e){
			absorbTouchEvent(e); 
			that.mouseMove(e);
		});
		$(document).on('contextmenu',SCG.canvasIdSelector, function(e){
			e.preventDefault();
			return false;
		});
	},
	permanentKeyDown : function (event)
	{
		this.keyboardstate.shiftPressed =event.shiftKey;
		this.keyboardstate.ctrlPressed =event.ctrlKey;
		this.keyboardstate.altPressed =event.altKey;
	},
	permanentKeyUp : function (event)
	{
		this.keyboardstate.shiftPressed =event.shiftKey;
		this.keyboardstate.ctrlPressed =event.ctrlKey;
		this.keyboardstate.altPressed =event.altKey;
		switch(event.which)
		{
			case 32:
				if(event.shiftKey){ 
					SCG.gameLogics.isPausedStep = true;
				}
				else{
					SCG.gameLogics.isPaused = !SCG.gameLogics.isPaused;	
				}
				break;
			case 69:
				SCG.GO.EnemyPaths.show = !SCG.GO.EnemyPaths.show;
				break;
			case 80: //show placeable
				SCG.Placeable.show = !SCG.Placeable.show;
				break;
			default:
				break;
		}
	}
};

SCG.gameControls.permanentEventInit();