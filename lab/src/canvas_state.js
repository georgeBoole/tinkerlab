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
    this.last_update = Date.now();
    var myState = this;
    setInterval(function() { myState.update(); myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

CanvasState.prototype.update = function() {
  var now = Date.now();
  var dt = (now - this.last_update) / 1000; //seconds since last update
  var shapes = this.shapes;
  for (var i = 0; i < shapes.length; i++) {
    shapes[i].update(dt);
    shapes[i].x = shapes[i].x % this.width;
    shapes[i].y = shapes[i].y % this.height;
  }
  this.last_update = now;
}

CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
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