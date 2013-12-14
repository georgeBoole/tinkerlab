
function RGBA(color) {
    return 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + color[3] + ')';
}

function Rect(x,y,w,h,color) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.color = typeof color == "string" ? color : RGBA(color);
}

Rect.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
}

Rect.prototype.update = function(dt) {

}

Rect.prototype.contains = function(mx,my) {
    return (this.x <= mx) && (this.x + this.w >= mx) && (this.y <= my) && (this.y + this.h >= my);
}

function Circle(x,y,r,color) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = 2 * r;
    this.h = 2 * r;
    this.color = typeof color == "string" ? color : RGBA(color);
}

Circle.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

Circle.prototype.update = function(dt) {

}