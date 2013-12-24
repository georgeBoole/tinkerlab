
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
    ctx.restore();
  }
});