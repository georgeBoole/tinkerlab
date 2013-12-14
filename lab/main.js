

var initial_width = 40;
var initial_height = 40;
var r = 128, g = 128, b = 32, a = 0.9;
var controlled_shape = new Shape(
  (500 - initial_width) / 2, 
  (500 - initial_height) / 2, 
  initial_width, initial_height, [r, g, b, a]);

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
  gui.add(my_shape, 'x').onFinishChange(function(newValue) {
    refresh();
  });
  gui.add(my_shape, 'y').onFinishChange(function(newValue) {
    refresh();
  });
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