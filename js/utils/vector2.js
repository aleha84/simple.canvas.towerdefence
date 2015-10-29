function Vector2(x,y){
	if(x == undefined){
		x = 0;
	}
	if(y == undefined){
		y = 0;
	}
	this.x = x;
	this.y = y;

	this.distance = function(to){
		if(!to || !(to instanceof Vector2)){
			return undefined;
		}

		return new Vector2(to.x-this.x,to.y - this.y).module();
	}

	this.directionNonNormal = function(to){
		if(!to || !(to instanceof Vector2)){
			return new Vector2()
		}

		return new Vector2(to.x-this.x,to.y - this.y);
	}

	this.direction = function(to){
		if(!to || !(to instanceof Vector2)){
			return new Vector2()
		}

		return new Vector2(to.x-this.x,to.y - this.y).normalize();
	}

	this.normalize = function(){
		var module = this.module();
		this.x /= module;
		this.y /= module;
		return this;
	}

	this.module = function(){
		return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
	}

	this.add = function(summand, outer){
		if(outer === undefined)
		{
			outer = false;
		}
		if(summand instanceof Vector2){
			if(outer){
				return new Vector2(this.x + summand.x,this.y + summand.y);
			}
			else{
				this.x +=summand.x;
				this.y +=summand.y;	
			}
			
		}
	}

	this.substract = function(subtrahend,outer)
	{
		if(outer === undefined)
		{
			outer = false;
		}
		if(subtrahend instanceof Vector2){
			if(outer){
				return new Vector2(this.x - subtrahend.x,this.y - subtrahend.y);
			}
			else{
				this.x -=subtrahend.x;
				this.y -=subtrahend.y;	
			}			
		}
		return new Vector2;
	}

	this.mul = function(coef){
		return new Vector2(this.x*coef,this.y*coef);
	}

	this.dot = function(to)
	{
		return this.mulVector(to);
	}

	this.mulVector = function(to){
		if(!to || !(to instanceof Vector2)){
			return 0;
		}

		return this.x*to.x + this.y*to.y;
	}

	this.rotate = function(angle, inRad, isSelf){
		if(inRad === undefined)
		{
			inRad = false;
		}
		if(isSelf === undefined)
		{
			isSelf = false;
		}

		var result = new Vector2(this.x*Math.cos(inRad?angle:angle*Math.PI/180) - this.y* Math.sin(inRad?angle:angle*Math.PI/180),
						   this.x*Math.sin(inRad?angle:angle*Math.PI/180) + this.y* Math.cos(inRad?angle:angle*Math.PI/180) );

		if(isSelf)
		{
			this.x = result.x;
			this.y = result.y;
		}
		else{
			return result;
		}
	}

	this.clone = function(){
		return new Vector2(this.x,this.y);
	}

	this.equal = function(to){
		if(!to || !(to instanceof Vector2)){
			return false;
		}

		return this.x == to.x && this.y == to.y;
	}

	this.toString = function(){
		return String.format("x: {0}, y:{1}", this.x,this.y);
	}
}

Vector2.left = function(){
	return new Vector2(-1,0);
}

Vector2.right = function(){
	return new Vector2(1,0);
}

Vector2.up = function(){
	return new Vector2(0,-1);
}

Vector2.down = function(){
	return new Vector2(0,1);
}