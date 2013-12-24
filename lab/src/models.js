
var _shape_counter = 0;


var Shape = Base.extend({
  constructor: function(x,y,settings) {
    this.x = x;
    this.y = y;
    this.id = _shape_counter++;
    for (var key in settings) {
    	if (settings.hasOwnProperty(key)) {
    		this[key] = settings[key];
    	}
    }
  },
  update: function(dt) {

  },
  draw: function(ctx) {

  },
  contains: function(mx, my) {

  }
});

var Circle = Shape.extend({
  constructor: function(x,y,id,label,fill,stroke,radius) {
    this.base(x,y,id,label,fill,stroke,radius);
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
    return (Math.pow((px - this.x), 2) + Math.pow((py - this.y), 2)) <= this.radius * this.radius;
  }
});

var Polygon = Shape.extend({
  constructor: function(x,y,id,label,color,stroke,vertices) {
    this.base(x,y,id,label,color,stroke);
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