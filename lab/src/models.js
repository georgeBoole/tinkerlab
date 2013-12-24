
var _shape_counter = 0;
var sqrt = Math.sqrt;
var sq = function(x) { return Math.pow(x, 2); };

var Shape = Base.extend({
  constructor: function(x, y) {
    this.x = x;
    this.y = y;
    this.id = _shape_counter++;
  },
  update: function(dt) {

  },
  draw: function(ctx) {

  },
  contains: function(mx, my) {

  }
});

var ColorShape = Shape.extend({
	constructor: function(x, y, fill, stroke) {
		this.base(x, y);
		this.fill = fill;
		this.stroke = stroke;
	}
});

var Circle = ColorShape.extend({
  constructor: function(x, y, fill, stroke, radius) {
    this.base(x,y, fill, stroke);
    this.radius = radius;
  },
  draw: function(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.fill;
    ctx.arc(this.x,this.y,this.radius,0,2 * Math.PI);
    ctx.fill();
    ctx.restore();
  },
  contains: function(px, py) {
  	return (sq(px - this.x) + sq(py - this.y)) <= sq(this.radius);
  }
});

var Polygon = ColorShape.extend({
  constructor: function(x,y,fill, stroke, vertices) {
    this.base(x,y, fill,stroke);
    this.vertices = vertices;
    this.orientation = 0;
    this.currentOrientation = 0;
  },
  contains: function(mx, my) {
    var self = this;
    var vertices = this.vertices.map(function(vert) {
      return v(vert.x + self.x, vert.y + self.y);
    });
    var c = false;
    for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
      if ( ((vertices[i].y > my) != (vertices[j].y > my)) && (mx < (vertices[j].x-vertices[i].x) * (my-vertices[i].y) / (vertices[j].y-vertices[i].y) + vertices[i].x)) {
        c = !c;
      }
    }
    return c;
  },
  update: function(dt) {
  	if (Math.abs(this.currentOrientation - this.orientation) > 0.001) {
  		var rotation = (this.orientation - this.currentOrientation) % (Math.PI * 2);
  		// get center of polygon
  		var maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
  		for (var i = 0; i < this.vertices.length; i++) {
  			if (this.vertices[i].x > maxX) maxX = this.vertices[i].x;
  			if (this.vertices[i].y > maxY) maxY = this.vertices[i].y;
  		}
  		var center = v(maxX/2, maxY/2);
  		for (var i = 0; i < this.vertices.length; i++) {
  			var vt = this.vertices[i];
  			// adjust it to be relative to the center
  			var adjusted = v(vt.x - center.x, vt.y - center.y);
  			// rotate the adjusted
  			var cost = Math.cos(rotation);
  			var sint = Math.sin(rotation);
  			var newX = adjusted.x * cost - adjusted.y * sint;
  			var newY = adjusted.x * sint + adjusted.y * cost;
  			var newVert = v(newX + center.x, newY + center.y);
  			this.vertices[i] = newVert;
  		}
  		this.currentOrientation = this.orientation;
  	}
  },
  draw: function(ctx) {
    ctx.save();
    ctx.fillStyle = this.fill;
    ctx.beginPath();
    ctx.moveTo(this.vertices[0].x + this.x, this.vertices[0].y + this.y);
    for (var i = 1; i < this.vertices.length; i++) {
      var v = this.vertices[i];
      ctx.lineTo(v.x + this.x, v.y + this.y);
    }
    ctx.closePath();
    ctx.fill();
    // var maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE;
  		// for (var i = 0; i < this.vertices.length; i++) {
  		// 	if (this.vertices[i].x > maxX) maxX = this.vertices[i].x;
  		// 	if (this.vertices[i].y > maxY) maxY = this.vertices[i].y;
  		// }
  		
    // ctx.fillStyle = "rgba(255,255,255,0.4)";
    // ctx.fillRect(this.x, this.y, maxX, maxY);
    ctx.restore();
  }
});