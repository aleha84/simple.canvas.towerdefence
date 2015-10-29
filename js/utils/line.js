function Line(prop)
{
	this.begin = new Vector2;
	this.end = new Vector2;
	this.color = '#ffffff';
	this.width = 1;
	$.extend(this,prop);
	// if(prop.begin!=undefined)
	// {
	// 	this.begin = prop.start;
	// }
	// if(prop.end != undefined)
	// {
	// 	this.end = prop.end;
	// }
	// if(prop.color!=undefined)
	// {
	// 	this.color = prop.color;
	// }

	this.render = function  () {
		SCG2.context.beginPath();
		SCG2.context.moveTo(this.begin.x, this.begin.y);
		SCG2.context.lineTo(this.end.x, this.end.y);
		SCG2.context.lineWidth = this.width;
		SCG2.context.strokeStyle = this.color;
		SCG2.context.stroke();
	}

	this.update = function  (prop) {
		$.extend(this,prop);
	}

	this.calculateBoundingSphere = function(){
		var center = new Vector2((this.end.x - this.begin.x)/2,(this.end.y - this.begin.y)/2)
		var radius = this.begin.distance(this.end)/2;
		return new Circle(center,radius);
	}

	this.calculateBoundingBox = function  () {
		var topLeft = new Vector2;
		topLeft.x = this.begin.x < this.end.x?  this.begin.x : this.end.x;
		topLeft.y = this.begin.y < this.end.y? this.begin.y : this.end.y;
		var size = new Vector2(Math.abs(this.end.x - this.begin.x), Math.abs(this.end.y - this.begin.x));
		return new Box(topLeft,size);
	}
}