
function RGBA(color) {
    return 'rgba(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + color[3] + ')';
}

function Shape(x,y,w,h,color) {
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
    this.color = color;
}

Object.defineProperty(Shape.prototype, 'fill', {
    get: function() {
        return RGBA(this.color);
    }
});

Shape.prototype.draw = function(ctx) {
    ctx.fillStyle = this.fill;
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

function CanvasState(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');

    this.valid = false; //When false redraw canvas
    this.shapes = []; //Collection of shapes to be drawn
    this.dragging = false;
    this.selection = null;
    this.dragoffx = 0;
    this.dragoffy = 0;

    var myState = this;
    setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.ctx;
    var shapes = this.shapes;
    this.clear();
    
    // ** Add stuff you want drawn in the background all the time here **
    
    // draw all shapes
    var l = shapes.length;
    for (var i = 0; i < l; i++) {
      var shape = shapes[i];
      // We can skip the drawing of elements that have moved off the screen:
      if (shape.x > this.width || shape.y > this.height ||
          shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
      shapes[i].draw(ctx);
    }
    
    // ** Add stuff you want drawn on top all the time here **
    
    this.valid = true;
  }
}

var initial_width = 40;
var initial_height = 40;
var r = 128, g = 128, b = 32, a = 0.9;
var controlled_shape = new Shape(
  (500 - initial_width) / 2, 
  (500 - initial_height) / 2, 
  initial_width, initial_height, r, g, b, a);

init();

function init() {
    var s = new CanvasState(document.getElementById('canvas'));
    window.canvasState = s;
    s.addShape(controlled_shape);
}

function refresh() {
    window.canvasState.valid = false;
}

window.onload = function() {
  var gui = new dat.GUI();
  var my_shape = controlled_shape;
  var cs = window.canvasState;
  gui.add(my_shape, 'x').listen();
  gui.add(my_shape, 'y').listen();
  gui.add(my_shape, 'w').onFinishChange(function(newValue) {
    refresh();
  });
  gui.add(my_shape, 'h').onFinishChange(function(newValue) {
    refresh();
  });
  gui.addColor(my_shape, 'color').onChange(function(newValue) {
    refresh();
  });

};