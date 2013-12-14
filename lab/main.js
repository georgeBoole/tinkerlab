var initial_width = 40;
var initial_height = 40;
var r = 128, g = 128, b = 32, a = 0.9;
var active_sprite = new Sprite(0,0,0,0,initial_width,initial_height,'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')');
var GC = new GrowingCircle(100,200,50,100,'rgba(100,100,100,1.0)',2);

init();

function init() {
    var s = new CanvasState(document.getElementById('canvas'));
    window.canvasState = s;

    // center the active sprite
    active_sprite.x = (s.width - active_sprite.w) / 2;
    active_sprite.y = (s.height - active_sprite.h) / 2;
    s.addShape(active_sprite);
    s.addShape(GC);
}

function refresh() {
    window.canvasState.valid = false;
}

window.onload = function() {
  var gui = new dat.GUI();
  var my_shape = active_sprite;
  var cs = window.canvasState;
  gui.add(my_shape, 'x');
  gui.add(my_shape, 'y');
  gui.add(my_shape, 'w');
  gui.add(my_shape, 'h');
  gui.add(my_shape, 'vx');
  gui.add(my_shape, 'vy');
  gui.addColor(my_shape, 'color');

  var gcgui = new dat.GUI();
  gcgui.add(GC,'x');
  gcgui.add(GC,'y');
  gcgui.add(GC,'size1');
  gcgui.add(GC,'size2');
  gcgui.add(GC,'animTime');
  gcgui.add(GC,'radius').listen();
  gcgui.add(GC,'loop');
  gcgui.addColor(GC,'fill');
  

};