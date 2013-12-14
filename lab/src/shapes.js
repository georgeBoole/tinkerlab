
function RGBA(color) {
    return 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + color[3] + ')';
}

function Shape(x,y,w,h,color) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.color = typeof color == "string" ? color : RGBA(color);
}

Shape.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

Shape.prototype.contains = function(mx,my) {
  return (this.x <= mx) && (this.x + this.w >= mx) &&
  (this.y <= my) && (this.y + this.h >= my);
}

function Path(x,y,pointList,fill,lineWidth) {
  this.x = x || 0;
  this.y = y || 0;
  this.pointList = pointList || [{x:100,y:100},{x:200,y:200}];
  this.fill = fill || '#AAAAAA';
  this.lineWidth = lineWidth || "5";
}

Path.prototype.draw = function(ctx) {
  ctx.beginPath();
  ctx.lineWidth = this.lineWidth;
  ctx.strokeStyle = this.fill;
  ctx.moveTo(this.x,this.y);
  for(var i = 0; i < this.pointList.length; i++) {
    var point = this.pointList[i];
    var px = point.x;
    var py = point.y;
    ctx.lineTo(px,py);
  }
  ctx.closePath();
  ctx.stroke();
}

Path.prototype.contains = function(mx,my) {
  return (this.x <= mx) && (this.x + this.w >= mx) &&
  (this.y <= my) && (this.y + this.h >= my);
}