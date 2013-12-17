
function RGBA(color) {
    return 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + color[3] + ')';
}

function Rect(x,y,w,h,color,orientation) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this._orientation = orientation || 0;
    this.color = typeof color == "string" ? color : RGBA(color);
}

Object.defineProperty(Rect.prototype, 'orientation', {
  get: function() {
    return this._orientation * (180/Math.PI);
  },
  set: function(value) {
    this._orientation = value % 2*Math.PI;
  }
});

Rect.prototype.draw = function(ctx) {
  ctx.save();
    ctx.fillStyle = this.color;
    //ctx.rotate(this.orientation);
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.restore();
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
    this.r = r;
    this.color = typeof color == "string" ? color : RGBA(color);
}

function Triangle(ax, ay, bx, by, cx, cy, color, orientation) {
    this.x = Math.min(ax, bx, cx);
    this.y = Math.min(ay, by, cy);
    this.ax = ax;
    this.ay = ay;
    this.bx = bx;
    this.by = by;
    this.cx = cx;
    this.cy = cy;
    this.orientation = orientation || 0;
    this.color = color;
}

Object.defineProperty(Triangle.prototype, 'orientation', {
  get: function() {
    return this._orientation * (180/Math.PI);
  },
  set: function(value) {
    this._orientation = value % 2*Math.PI;
  }
});

Triangle.prototype.draw = function(ctx) {
  ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.color;
    //ctx.rotate(this.orientation);
    ctx.moveTo(this.ax,this.ay);
    ctx.lineTo(this.bx,this.by);
    ctx.lineTo(this.cx,this.cy);
    ctx.closePath();
    ctx.fill();
  ctx.restore();
}

Triangle.prototype.update = function(dt) {

}

Triangle.prototype.contains = function(x, y) {
    var pt = {'x':x, 'y':y};
    var v1 = {'x':this.ax, 'y':this.ay}, v2 = {'x':this.bx, 'y':this.by}, v3 = {'x':this.cx, 'y':this.cy};

    var sign = function(p1, p2, p3) {
        return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
    };
    var b1, b2, b3;
    b1 = sign(pt, v1, v2) < 0.0;
    b2 = sign(pt, v2, v3) < 0.0;
    b3 = sign(pt, v3, v1) < 0.0;
    return ((b1 == b2) && (b2 == b3));
}

function QuadCurve(x,y,cp1x,cp1y,cp2x,cp2y,color,orientation) {
    this.x = x;
    this.y = y;
    this.cp1x = cp1x;
    this.cp1y = cp1y;
    this.cp2x = cp2x;
    this.cp2y = cp2y;
    this.orientation = orientation || 0;
    this.color = color;
}

Object.defineProperty(QuadCurve.prototype, 'orientation', {
  get: function() {
    return this._orientation * (180/Math.PI);
  },
  set: function(value) {
    this._orientation = value % 2*Math.PI;
  }
});

QuadCurve.prototype.draw = function(ctx) {
    ctx.strokeStyle = this.color;
    //ctx.rotate(this.orientation);
    ctx.moveTo(x,y);
    ctx.quadraticCurveTo(cp1x,cp1y,cp2x,cp2y);
    ctx.stroke();
}
QuadCurve.prototype.update = function(dt) {
    
}