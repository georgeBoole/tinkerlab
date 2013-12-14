function CanvasState(canvas) {
    this.canvas = canvas;
    this.bgcolor = "#000000";
    this.width = canvas.width;
    this.height = canvas.height;
    this.ctx = canvas.getContext('2d');
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
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
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
  ctx.fillStyle = this.bgcolor;
  ctx.fillRect(0, 0, this.width, this.height);

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
  
}