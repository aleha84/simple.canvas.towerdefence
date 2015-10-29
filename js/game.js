var SCG = {};

SCG.battlefield = {
	default: {
		width: 1024,
		height: 768
	},
	width: 1024,
	height: 768,
};

SCG.canvas = undefined;
SCG.context = undefined;
SCG.gameLogics = {
	isPaused: false,
	isPausedStep: false,
	gameOver: false,
	drawBoundings: true,
	fillBoundings: false,
}

SCG.go = [];
SCG.nonplayableGo = [];
SCG.visibleGo = [];

SCG.gameControls = {
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
		}
	},
	keyboardstate: {
		altPressed : false,
		shiftPressed : false,
		ctrlPressed: false
	},
	selectedGOs : [],
	mouseDown: function(event){
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
	},
	mouseOut: function(event){
		SCG.gameControls.mousestate.reset();
	},
	mouseUp: function(event){
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

		/*simple selection, without selection rectangle and checking for mouse buttons*/

		//clean current selected gos
		event.preventDefault();

		for (var i = SCG.gameControls.selectedGOs.length - 1; i >= 0; i--) {
			SCG.gameControls.selectedGOs[i].selected = false;
		};
		SCG.gameControls.selectedGOs = [];
	},
	permanentEventInit : function (){
		var that = this;
		$(document).on('keydown',function(e){
			that.permanentKeyDown(e);
		});
		$(document).on('keyup',function(e){
			that.permanentKeyUp(e);
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
	}
};

SCG.gameControls.permanentEventInit();