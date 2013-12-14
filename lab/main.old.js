
var rgba = function(r, g, b, a) {
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

var rgbaa = function(rgb) {
  return rgba(rgb[0], rgb[1], rgb[2], rgb[3]);
};

function Shape(x,y,w,h,r,g,b,a) {
	this.x = x || 0;
  this.y = y || 0;
  this.w = w || 1;
  this.h = h || 1;
  this.color = [ r, g, b, a ];
  this.fill = rgba(r,g,b,a);
}

Shape.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x,this.y,this.w,this.h);
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

Path.prototype.jiggle = function(magnitude) {

}

function CanvasState(canvas) {
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  this.valid = false; //When false redraw canvas
  this.shapes = []; //Collection of shapes to be drawn
  this.dragging = false;
  this.selection = null;
  this.dragoffx = 0;
  this.dragoffy = 0;

  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;

  canvas.addEventListener('selectstart', function(e) {e.preventDefault(); return false;}, false);
  canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var shapes = myState.shapes;
    for(var i = 0; i < shapes.length; i++) {
      if(shapes[i].contains(mx,my)) {
        var mySel = shapes[i];
        //Make sure we're grabbing it at the right spot
        myState.dragoffx = mx - mySel.x;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
    }
  }, true);
  canvas.addEventListener('mousemove', function(e) {
    if (myState.dragging){
      var mouse = myState.getMouse(e);
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;   
      myState.valid = false; // Something's dragging so we must redraw
    }
  }, true);
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
  }, true);
  // double click for making new shapes
  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    //myState.addShape(new Shape(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
  }, true);
  
  // **** Options! ****
  
  this.selectionColor = '#CC0000';
  this.selectionWidth = 2;  
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addShape = function(shape) {
  this.shapes.push(shape);
  this.valid = false;
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
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
    
    // draw selection
    // right now this is just a stroke along the edge of the selected Shape
    if (this.selection != null) {
      ctx.strokeStyle = this.selectionColor;
      ctx.lineWidth = this.selectionWidth;
      var mySel = this.selection;
      ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
    }
    
    // ** Add stuff you want drawn on top all the time here **
    
    this.valid = true;
  }
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

<<<<<<< HEAD
// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
init();

function init() {
  var s = new CanvasState(document.getElementById('canvas'));
  window.cs = s;
  s.addShape(new Shape(80,80,100,100)); // The default is gray
  s.addShape(new Shape(120,280,40,60, 'lightskyblue'));
  // Lets make some partially transparent
  s.addShape(new Shape(160,300,60,30, 'rgba(127, 255, 212, .5)'));
  s.addShape(new Shape(250,160,30,80, 'rgba(245, 222, 179, .7)'));
  s.addShape(new Path(100,100,[{x:120,y:120},{x:110,y:140},{x:130,y:140},{x:140,y:130},{x:160,y:110},{x:130,y:90}],'red',"3"))
=======
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
  window.canvas_state = s;
  s.addShape(controlled_shape);
}

var refresh = function() {
  window.canvas_state.valid = false;
};

window.onload = function() {
  var gui = new dat.GUI();
  var my_shape = controlled_shape;
  var cs = window.canvas_state;
  gui.add(my_shape, 'x');
  gui.add(my_shape, 'y');
  gui.add(my_shape, 'w').onFinishChange(function(newValue) {
    refresh();
  });
  gui.add(my_shape, 'h').onFinishChange(function(newValue) {
    refresh();
  });
  gui.addColor(my_shape, 'color').onChange(function(newValue) {
    console.log('new color is ' + newValue);
    my_shape.fill = rgbaa(newValue);
    refresh();
  });

};


