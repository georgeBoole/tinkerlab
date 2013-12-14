
var config = {
	bgcolor: '#000000',
	width: 1000,
	height: 800
}

var sprite_build = {
	name: 'sprite',
	width: config.width,
	height: config.height,
	objects: []
}

var gui_state = {
	brush: "rectangle" // Circle, Triangle

}

init();

function init() {
    var s = new CanvasState(document.getElementById('canvas'));
    window.canvasState = s;
    window.shapes = s.shapes;

    var cvs = s.canvas;
    cvs.addEventListener('dblclick', function(e) {
      var mouse = {x:e['offsetX'], y:e['offsetY']};
      var col = function() { return String(Math.floor(Math.random() * 255)); };
      var color = 'rgba(' + col() + ',' + col() + ',' + col() + ', ' + String(.70 + .30 * Math.random()) + ')';
      console.log(color);
      var shape = undefined;
      if (gui_state['brush'] == 'rectangle') {
      	shape = new Rect(mouse.x - 40, mouse.y - 40, 80, 80, color);
      }
      else if (gui_state['brush'] == 'triangle') {
        shape = new Triangle(mouse.x - 40, mouse.y, mouse.x + 40, mouse.y, mouse.x, mouse.y + 55, color);
      }
      else if (gui_state['brush'] == 'circle') {
      	shape = new Circle(mouse.x, mouse.y, 30, color);
      }
      if (shape != undefined) {
      	s.addShape(shape);
      }
    }, true);
    
    
}

function init_gui() {
	// display the general app config panel
	var app_config = new dat.GUI();

	var canvas_config = app_config.addFolder('Canvas');
	var cs = window.canvasState;
	canvas_config.add(config, 'width').name('Width').onFinishChange(function(new_value) {
		cs.canvas.width = new_value;
	});
	canvas_config.add(config, 'height').name('Height').onFinishChange(function(new_value) {
		cs.canvas.height = new_value;
	});
	canvas_config.addColor(config, 'bgcolor').name('BG Color').onChange(function(new_color) {
		window.canvasState.bgcolor = new_color;
	});
	canvas_config.open();

	// display the sprite creation management panel
	var sprite_builder = new dat.GUI();
	sprite_builder.add(sprite_build, 'name');
	sprite_builder.add(gui_state, 'brush', {'Triangle':'triangle', 'Rectangle':'rectangle', 'Circle':'circle'}).name('Brush');

}

window.onload = function() {
	init_gui();
};

