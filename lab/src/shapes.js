
function RGBA(color) {
    return 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + color[3] + ')';
}

function LineSegment(x,y) {
    this.x = x;
    this.y = y;
}

LineSegment.prototype.draw = function(ctx) {
    
}

LineSegment.prototype.update = function(dt) {

}


var Rectangle = new LineSegment(color,w,h) {
    this.w = w;
    this.h = h;
    this.color = typeof color == "string" ? color : RGBA(color);
}

Rectangle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

Rectangle.prototype.update = function(dt) {

}

Rectangle.prototype.contains = function(mx,my) {
    return (this.x <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);
}


var Triangle = new Rectangle(p1x,p1y,p2x,p2y) {
    this.p1x = p1x;
    this.p1y = p1y;
    this.p2x = p2x;
    this.p2y = p2y;
    // this.p3x = p3x;
    // this.p3y = p3y;
}

Triangle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.moveTo(this.p1x,this.p1y);
    ctx.lineTo(this.p2x,this.p2y);
    //ctx.lineTo(this.p3x,this.p3y);
    ctx.closePath();
    ctx.fill();
}

Triangle.prototype.update = function(dt) {

}

var Sprite = new Rectangle(x,y,vx,vy,w,h,color) {
    this.vx = vx;
    this.vy = vy;
}

Sprite.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

Sprite.prototype.update = function(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
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
    return (this.x <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);
}



// Need work here still

function GrowingCircle(x,y,size1,size2,fill,animTime,loop) {
   this.x = x;
   this.y = y;
   this.size1 = size1;
   this.size2 = size2;
   this.fill = fill;
   this.animTime  = animTime;
   this.rate = (size2-size1)/animTime;
   this.lapsed = 0;
   this.loop = loop || false;
}

Object.defineProperty(GrowingCircle.prototype, 'radius', {
    get: function() {
        return this.size1 + (((this.size2-this.size1)/this.animTime) * (this.lapsed % this.animTime)); 
    }
});

GrowingCircle.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.fillStyle = this.fill;
    ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

GrowingCircle.prototype.update = function(dt) {
    this.lapsed += dt;
    if (!this.loop) {
        this.lapsed = Math.min(this.animTime, this.lapsed);
    }
}

function Bezier(x1,y1,cx1,cy1,cx2,cy2,x2,y2,fill) {
    this.x1 = x1;
    this.x2 = x2;
    this.cx1 = cx1;
    this.cy1 = cy1;
    this.cx2 = cx2;
    this.cy2 = cy2;
    this.fill = fill;
}

Bezier.prototype.draw = function(ctx) {
    ctx.beginPath();
    ctx.strokeStyle('red');
    ctx.moveTo(x1,y1);
    ctx.bezierCurveTo(this.cx1,this.cy1,this.cx2,this.cy2,this.x2,this.y2)
}

Bezier.prototype.update = function(dt) {

}