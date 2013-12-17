
function RGBA(color) {
    return 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + color[3] + ')';
}

// int pnpoly(int nvert, float *vertx, float *verty, float testx, float testy)
// {
//   int i, j, c = 0;
//   for (i = 0, j = nvert-1; i < nvert; j = i++) {
//     if ( ((verty[i]>testy) != (verty[j]>testy)) &&
//      (testx < (vertx[j]-vertx[i]) * (testy-verty[i]) / (verty[j]-verty[i]) + vertx[i]) )
//        c = !c;
//   }
//   return c;
// }


var Vector = Base.extend({
  constructor: function(x, y) {
    this.x = x;
    this.y = y;
  },
  length: function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
});

var v = function(x,y) {
  return new Vector(x, y);
}

var Shape = Base.extend({
  constructor: function(x,y,id,label,fill, stroke) {
    this.x = x;
    this.y = y;
    this.id = id;
    this.label = label;
    this.fill = fill;
    this.stroke = stroke;
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

var buildPoly = function(x,y) {
  var cs = window.canvasState;
  cs.addShape(new Polygon(x, y, 1, 'derp', 'rgba(0,0,255,1.0)', 'rgba(0,128,128,1.0)', [v(0,0),v(100,0),v(100,100),v(0,100)]));
}