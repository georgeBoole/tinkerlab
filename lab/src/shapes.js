
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

Shape.prototype.update = function(dt) {

}

Shape.prototype.contains = function(mx,my) {
    return (this.x <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);
}

function Sprite(x,y,vx,vy,w,h,color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.w = w;
    this.h = h;
    this.color = color || '#AAAAAA';
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
    ctx.stroke();
}

GrowingCircle.prototype.update = function(dt) {
    this.lapsed += dt;
    if (!this.loop) {
        this.lapsed = Math.min(this.animTime, this.lapsed);
    }
}