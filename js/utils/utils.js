window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
})();


function initializer(callback) {
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in SCG.src) {
      numImages++;
    }
    for(var src in SCG.src) {
      SCG.images[src] = new Image();
      SCG.images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback();
        }
      };
      SCG.images[src].src = SCG.src[src];
    }
  }

function getRandom(min, max){
	return Math.random() * (max - min) + min;
}

function getRandomInt(min, max){
  return Math.round(getRandom(min, max));
}

function boxIntersectsBox(a,b)
{
  return (Math.abs(a.center.x - b.center.x) * 2 < (a.size.x + b.size.x)) &&
         (Math.abs(a.center.y - b.center.y) * 2 < (a.size.y + b.size.y));
}

function boxCircleIntersects(circle, rect)
{ 
	var circleDistance = new Vector2(Math.abs(circle.center.x - rect.center.x),Math.abs(circle.center.y - rect.center.y));
	if(circleDistance.x > (rect.size.x/2 + circle.radius))
	{
		return false;
	}
	if(circleDistance.y > (rect.size.y/2 + circle.radius))
	{
		return false;
	}

	if(circleDistance.x <= (rect.size.x/2)) 
	{
		return true; 
	}
	if(circleDistance.y <= (rect.size.y/2))
	{
		return true;
	}
	var cornerDistance_sq = Math.pow(circleDistance.x - rect.size.x/2,2) + Math.pow(circleDistance.y - rect.size.y/2,2);
	return (cornerDistance_sq <= Math.pow(circle.radius,2))
}

function segmentIntersectBox(segment,box)
  {
    var minX = segment.begin.x;
    var maxX = segment.end.x;
    if(segment.begin.x > segment.end.x)
    {
      minX = segment.end.x;
      maxX = segment.begin.x;
    }
   if(maxX > box.bottomRight.x)
    {
      maxX = box.bottomRight.x;
    }
    if(minX < box.topLeft.x)
    {
      minX = box.topLeft.x;
    }
    if(minX > maxX) 
    {
      return false;
    }
    var minY = segment.begin.y;
    var maxY = segment.end.y;
    var dx = segment.end.x - segment.begin.x;
    if(Math.abs(dx) > 0.0000001)
    {
      var a = (segment.end.y - segment.begin.y) / dx;
      var b = segment.begin.y - a * segment.begin.x;
      minY = a * minX + b;
      maxY = a * maxX + b;
    }
    if(minY > maxY)
    {
      var tmp = maxY;
      maxY = minY;
      minY = tmp;
    }
    if(maxY > box.bottomRight.y)
    {
      maxY = box.bottomRight.y;
    }
    if(minY < box.topLeft.y)
    {
      minY = box.topLeft.y;
    }
    if(minY > maxY) // If Y-projections do not intersect return false
    {
      return false;
    }
    return true;
  }

function segmentIntersectCircle(segment,circle)
{
    // return ((circle.center.x - circle.radius <= segment.begin.x && segment.begin.x <= circle.center.x + circle.radius ) && (circle.center.y - circle.radius <= segment.begin.y && segment.begin.y <= circle.center.y + circle.radius )
    //   || (circle.center.x - circle.radius <= segment.end.x && segment.end.x <= circle.center.x + circle.radius ) && (circle.center.y - circle.radius <= segment.end.y && segment.end.y <= circle.center.y + circle.radius ));
    var d = segment.end.substract(segment.begin,true);
    var f = segment.begin.substract(circle.center,true);

    var a = d.dot(d);
    var b = 2*f.dot(d);
    var c = f.dot(f) - Math.pow(circle.radius,2);
    var discriminant = b*b-4*a*c;
    if(discriminant<0)
    {
      return false;
    }

    discriminant = Math.sqrt(discriminant);
    var t1 = (-b - discriminant)/(2*a);
    var t2 = (-b + discriminant)/(2*a);

    if(t1 >= 0 && t1 <=1)
    {
      return true;
    }
    if(t2>=0 && t2 <=1)
    {
      return true;
    }
    return false;
}

function segmentIntersectCircle2(segment,circle)
{
  var d1 = circle.center.distance(segment.begin);
  var d2 = circle.center.distance(segment.end);
  return d1 <= circle.radius || d2 <= circle.radius;
}

function segmentsIntersectionVector2(line1, line2)
{
  var x1 = +line1.begin.x.toFixed(2);
  var x2 = +line1.end.x.toFixed(2);
  var y1 = +line1.begin.y.toFixed(2);
  var y2 = +line1.end.y.toFixed(2);
  var x3 = +line2.begin.x.toFixed(2);
  var x4 = +line2.end.x.toFixed(2);
  var y3 = +line2.begin.y.toFixed(2);
  var y4 = +line2.end.y.toFixed(2);

  var d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
  if(d == 0)
  {
    return undefined;
  }

  var xi = +(((x3-x4)*(x1*y2-y1*x2)-(x1-x2)*(x3*y4-y3*x4))/d).toFixed(2);
  var yi = +(((y3-y4)*(x1*y2-y1*x2)-(y1-y2)*(x3*y4-y3*x4))/d).toFixed(2);

  var p = new Vector2(xi,yi);
  if (xi < Math.min(x1,x2) || xi > Math.max(x1,x2)) return undefined;
  if (xi < Math.min(x3,x4) || xi > Math.max(x3,x4)) return undefined;
  if (yi < Math.min(y1,y2) || yi > Math.max(y1,y2)) return undefined; 
  if (yi < Math.min(y3,y4) || yi > Math.max(y3,y4)) return undefined;
  return p;
}

function segmentsIntersection(line1, line2)
{
  var CmP = line1.begin.directionNonNormal(line2.begin);
  var r = line1.begin.directionNonNormal(line1.end);
  var s = line2.begin.directionNonNormal(line2.end);

  var CmPxr = CmP.x * r.y - CmP.y*r.x;
  var CmPxs = CmP.x * s.y - CmP.y * s.x;
  var rxs = r.x * s.y - r.y*s.x;

  if(CmPxr == 0)
  {
    return ((line2.begin.x - line1.begin.x < 0) != (line2.begin.x - line1.end.x < 0)) || ((line2.begin.y - line1.begin.y < 0) != (line2.begin.y - line1.end.y < 0));
  }

  if(rxs == 0)
  {
    return false;
  }

  var rxsr = 1.0/rxs;
  var t = CmPxs * rxsr;
  var u = CmPxr * rxsr;

  return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
}

function radiansToDegree (radians) {
  if(radians === undefined)
  {
    return 0;
  }
  return radians * 180/Math.PI;
}

function degreeToRadians (degree) {
  if(degree === undefined)
  {
    return 0;
  }
  return degree * Math.PI / 180;
}

function isBoolean(variable)
{
  return variable.constructor === Boolean || typeof variable === 'boolean';
}

function isString(variable)
{
  return typeof myVar == 'string' || myVar instanceof String;
}

function isArray(obj)
{
  return Object.prototype.toString.call(obj) === '[object Array]';
}

var pointerEventToXY = function(e){
  var out = {x:0, y:0};
  if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
    var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
    out.x = touch.pageX;
    out.y = touch.pageY;
  } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
    out.x = e.pageX;
    out.y = e.pageY;
  }
  return out;
};

function absorbTouchEvent(event) {
  if(event.type == 'touchstart' || event.type == 'touchmove' || event.type == 'touchend' || event.type == 'touchcancel'){
    var e = event || window.event;
    e.preventDefault && e.preventDefault();
    e.stopPropagation && e.stopPropagation();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;   
  }
  
}

function checkClamps(clamps, value)
{
  if(!isArray(clamps) || isEmpty(clamps)){
    return 1;
  }

  if(value > clamps[1]){
    value = clamps[1];
  }
  else if(value < clamps[0]){
    value = clamps[0];
  }

  if(value == clamps[0] || value == clamps[1]){
    return -1;
  }

  return 1;
}

function isBetween(x, begin, end)
{
  if(begin > end)
  {
    var swap = end;
    end = begin;
    begin = swap;
  }

  return x >= begin && x <= end;

}

function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function sqr(x) { return x * x }

function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }

function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}

function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

function getDegreeToVectorUp(p1, p2){
  var up = Vector2.up();
  var v1 = p2.substract(p1,true);
  return  Math.acos((v1.mulVector(up))/(v1.module()*up.module()));
}

function doWorkByTimer(timer, now){
  if(SCG.gameLogics.isPaused){
    timer.lastTimeWork = now;
    timer.delta = 0;
    return;
  }

  timer.delta = now - timer.lastTimeWork;
  if(SCG.gameLogics.pauseDelta != 0){
    timer.delta -= SCG.gameLogics.pauseDelta;
  }

  timer.currentDelay -= timer.delta;
  if(timer.currentDelay <= 0){
    timer.currentDelay = timer.originDelay;
    timer.doWorkInternal.call(timer.context);  
  }
  
  timer.lastTimeWork = now;
}